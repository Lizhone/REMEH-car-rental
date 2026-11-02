
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from secrets import token_urlsafe
from urllib.parse import urlencode

from authlib.integrations.flask_client import OAuth
from flask import Blueprint, current_app, jsonify, redirect, request
from flask_jwt_extended import create_access_token
from sqlalchemy import delete, select
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db
from app.models.customer import Customer
from app.models.oauth_login_code import OAuthLoginCode


auth_bp = Blueprint("auth", __name__)
oauth = OAuth()

GOOGLE_CODE_LIFETIME_SECONDS = 120


def init_oauth(app):
    """Register Google's OAuth client with Flask."""
    oauth.init_app(app)

    client_id = app.config.get("GOOGLE_CLIENT_ID")
    client_secret = app.config.get("GOOGLE_CLIENT_SECRET")

    if client_id and client_secret:
        oauth.register(
            name="google",
            client_id=client_id,
            client_secret=client_secret,
            server_metadata_url=(
                "https://accounts.google.com/.well-known/openid-configuration"
            ),
            client_kwargs={"scope": "openid email profile"},
        )


def serialize_customer(customer: Customer) -> dict:
    return {
        "id": customer.id,
        "full_name": customer.full_name,
        "email": customer.email,
        "phone": customer.phone,
        "auth_provider": customer.auth_provider,
    }


def frontend_callback_url(**params) -> str:
    """Build a frontend callback URL without placing JWTs in the URL."""
    frontend_url = current_app.config.get(
        "FRONTEND_URL",
        "http://localhost:4200",
    ).rstrip("/")

    fragment = urlencode(params)
    return f"{frontend_url}/auth/google/callback#{fragment}"


# ---------------------------------------------------------
# EMAIL/PASSWORD REGISTRATION
# ---------------------------------------------------------

@auth_bp.post("/auth/register")
def register():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A valid JSON request body is required."}), 400

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    if not all(
        isinstance(value, str)
        for value in (full_name, email, password)
    ):
        return jsonify({
            "error": "Full name, email, and password are required."
        }), 400

    full_name = full_name.strip()
    email = email.strip().lower()

    if not full_name or not email or not password:
        return jsonify({
            "error": "Full name, email, and password are required."
        }), 400

    if len(full_name) > 160 or len(email) > 254:
        return jsonify({"error": "Name or email is too long."}), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters long."
        }), 400

    if len(password) > 128:
        return jsonify({"error": "Password is too long."}), 400

    if phone is not None and not isinstance(phone, str):
        return jsonify({"error": "Phone must be a string."}), 400

    if isinstance(phone, str) and len(phone.strip()) > 30:
        return jsonify({"error": "Phone number is too long."}), 400

    existing_customer = db.session.execute(
        select(Customer).where(Customer.email == email)
    ).scalar_one_or_none()

    if existing_customer:
        return jsonify({
            "error": "An account with this email already exists."
        }), 409

    customer = Customer(
        full_name=full_name,
        email=email,
        phone=phone.strip() if isinstance(phone, str) and phone.strip() else None,
        password_hash=generate_password_hash(password),
        auth_provider="email",
    )

    try:
        db.session.add(customer)
        db.session.commit()

        access_token = create_access_token(
            identity=str(customer.id),
            additional_claims={"email": customer.email},
        )

        return jsonify({
            "message": "Account created successfully.",
            "access_token": access_token,
            "customer": serialize_customer(customer),
        }), 201

    except Exception:
        db.session.rollback()
        current_app.logger.exception("Customer registration failed.")
        return jsonify({
            "error": "Unable to create account right now."
        }), 500


# ---------------------------------------------------------
# EMAIL/PASSWORD LOGIN
# ---------------------------------------------------------

@auth_bp.post("/auth/login")
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A valid JSON request body is required."}), 400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"error": "Email and password are required."}), 400

    email = email.strip().lower()

    customer = db.session.execute(
        select(Customer).where(Customer.email == email)
    ).scalar_one_or_none()

    if (
        customer is None
        or not customer.password_hash
        or not check_password_hash(customer.password_hash, password)
    ):
        return jsonify({"error": "Invalid email or password."}), 401

    access_token = create_access_token(
        identity=str(customer.id),
        additional_claims={"email": customer.email},
    )

    return jsonify({
        "message": "Login successful.",
        "access_token": access_token,
        "customer": serialize_customer(customer),
    }), 200


# ---------------------------------------------------------
# GOOGLE SIGN-IN: START
# ---------------------------------------------------------

@auth_bp.get("/auth/google")
def google_login():
    if (
        not current_app.config.get("GOOGLE_CLIENT_ID")
        or not current_app.config.get("GOOGLE_CLIENT_SECRET")
    ):
        return jsonify({
            "error": "Google sign-in is not configured."
        }), 503

    redirect_uri = current_app.config["GOOGLE_REDIRECT_URI"]
    return oauth.google.authorize_redirect(redirect_uri)


# ---------------------------------------------------------
# GOOGLE SIGN-IN: GOOGLE CALLBACK
# ---------------------------------------------------------

@auth_bp.get("/auth/google/callback")
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get("userinfo")

        if not user_info:
            user_info = oauth.google.userinfo()

        if not user_info:
            return redirect(
                frontend_callback_url(error="google_profile_unavailable")
            )

        google_sub = user_info.get("sub")
        email = user_info.get("email")
        full_name = user_info.get("name") or user_info.get("given_name")
        email_verified = user_info.get("email_verified", False)

        if (
            not google_sub
            or not isinstance(email, str)
            or not full_name
            or email_verified is not True
        ):
            return redirect(
                frontend_callback_url(error="google_email_not_verified")
            )

        email = email.strip().lower()

        customer = db.session.execute(
            select(Customer).where(Customer.google_sub == google_sub)
        ).scalar_one_or_none()

        if customer is None:
            existing_customer = db.session.execute(
                select(Customer).where(Customer.email == email)
            ).scalar_one_or_none()

            if existing_customer:
                # Never silently link separate sign-in methods.
                return redirect(
                    frontend_callback_url(error="account_exists")
                )

            customer = Customer(
                full_name=str(full_name)[:160],
                email=email,
                password_hash=None,
                auth_provider="google",
                google_sub=google_sub,
            )
            db.session.add(customer)
        else:
            customer.auth_provider = "google"

        db.session.commit()

        # Generate a random code. Store only its SHA-256 hash.
        raw_code = token_urlsafe(32)
        code_hash = sha256(raw_code.encode("utf-8")).hexdigest()

        expires_at = datetime.now(timezone.utc) + timedelta(
            seconds=GOOGLE_CODE_LIFETIME_SECONDS
        )

        login_code = OAuthLoginCode(
            code_hash=code_hash,
            customer_id=customer.id,
            expires_at=expires_at,
        )

        db.session.add(login_code)
        db.session.commit()

        # The code is short-lived and single-use. The JWT is never put in
        # the redirect URL. The fragment is read by Angular in the browser.
        return redirect(frontend_callback_url(code=raw_code))

    except Exception:
        db.session.rollback()
        current_app.logger.exception("Google sign-in failed.")
        return redirect(
            frontend_callback_url(error="google_signin_failed")
        )


# ---------------------------------------------------------
# GOOGLE SIGN-IN: EXCHANGE ONE-TIME CODE FOR JWT
# ---------------------------------------------------------

@auth_bp.post("/auth/google/exchange")
def google_exchange():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A valid JSON request body is required."}), 400

    raw_code = data.get("code")

    if not isinstance(raw_code, str) or not raw_code:
        return jsonify({"error": "A valid login code is required."}), 400

    code_hash = sha256(raw_code.encode("utf-8")).hexdigest()

    try:
        login_code = db.session.execute(
            select(OAuthLoginCode).where(
                OAuthLoginCode.code_hash == code_hash
            )
        ).scalar_one_or_none()

        if login_code is None:
            return jsonify({
                "error": "This login code is invalid or has already been used."
            }), 401

        expires_at = login_code.expires_at

        # Some database drivers may return a naive datetime.
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if datetime.now(timezone.utc) >= expires_at:
            db.session.delete(login_code)
            db.session.commit()
            return jsonify({
                "error": "This login code has expired. Please try again."
            }), 401

        customer = db.session.get(Customer, login_code.customer_id)

        if customer is None:
            db.session.delete(login_code)
            db.session.commit()
            return jsonify({"error": "Customer account was not found."}), 404

        # Consume the code before returning the JWT.
        db.session.execute(
            delete(OAuthLoginCode).where(
                OAuthLoginCode.id == login_code.id
            )
        )
        db.session.commit()

        access_token = create_access_token(
            identity=str(customer.id),
            additional_claims={"email": customer.email},
        )

        return jsonify({
            "message": "Google sign-in successful.",
            "access_token": access_token,
            "customer": serialize_customer(customer),
        }), 200

    except Exception:
        db.session.rollback()
        current_app.logger.exception("Google login code exchange failed.")
        return jsonify({
            "error": "Unable to complete Google sign-in. Please try again."
        }), 500
