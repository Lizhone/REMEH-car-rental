
from app.extensions import db


class OAuthLoginCode(db.Model):
    __tablename__ = "oauth_login_codes"

    id = db.Column(db.Integer, primary_key=True)

    code_hash = db.Column(
        db.String(64),
        nullable=False,
        unique=True,
        index=True,
    )

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customers.id"),
        nullable=False,
    )

    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
    )
