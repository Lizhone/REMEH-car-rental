
from app.extensions import db


class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(160), nullable=False)
    email = db.Column(db.String(254), nullable=False, unique=True, index=True)
    phone = db.Column(db.String(30))

    # Authentication fields
    password_hash = db.Column(db.String(255), nullable=True)
    auth_provider = db.Column(
        db.String(20),
        nullable=False,
        default="email",
        server_default="email",
    )
    google_sub = db.Column(db.String(255), nullable=True, unique=True)

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now(),
        onupdate=db.func.now(),
    )

    bookings = db.relationship("Booking", back_populates="customer")
