
import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mssql+pyodbc://@LAPTOP-C2KQL5SD\\SQLEXPRESS/REMEH_CarRental"
        "?driver=ODBC+Driver+17+for+SQL+Server"
        "&trusted_connection=yes",
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
    }

    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "local-development-only-change-before-deployment",
    )

    # JWT authentication
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = 3600

    
    # Google OAuth configuration
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI = os.environ.get(
        "GOOGLE_REDIRECT_URI",
        "http://127.0.0.1:5000/api/auth/google/callback",
    )
    FRONTEND_URL = os.environ.get(
        "FRONTEND_URL",
        "http://localhost:4200",
    )


    # CORS configuration
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            "CORS_ORIGINS",
            "http://localhost:4200",
        ).split(",")
        if origin.strip()
    ]
