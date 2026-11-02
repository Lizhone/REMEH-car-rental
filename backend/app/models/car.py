
from app.extensions import db


class Car(db.Model):
    __tablename__ = "cars"

    __table_args__ = (
        db.CheckConstraint(
            "year >= 1886",
            name="ck_cars_year_valid",
        ),
        db.CheckConstraint(
            "seats > 0",
            name="ck_cars_seats_positive",
        ),
        db.CheckConstraint(
            "daily_rate >= 0",
            name="ck_cars_daily_rate_nonnegative",
        ),
    )

    id = db.Column(db.Integer, primary_key=True)

    # Matches the existing Angular car IDs
    slug = db.Column(
        db.String(100),
        unique=True,
        index=True,
        nullable=True,
    )

    make = db.Column(db.String(80), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    transmission = db.Column(db.String(30), nullable=False)
    fuel_type = db.Column(db.String(30), nullable=False)
    seats = db.Column(db.Integer, nullable=False)
    daily_rate = db.Column(db.Numeric(10, 2), nullable=False)
    image_url = db.Column(db.String(500))
    is_available = db.Column(
        db.Boolean,
        nullable=False,
        default=True,
    )

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

    bookings = db.relationship(
        "Booking",
        back_populates="car",
    )
