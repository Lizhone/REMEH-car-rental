
from app.extensions import db


class Booking(db.Model):
    __tablename__ = "bookings"

    __table_args__ = (
        db.CheckConstraint(
            "return_datetime > pickup_datetime",
            name="ck_bookings_return_after_pickup",
        ),
        db.CheckConstraint(
            "total_amount >= 0",
            name="ck_bookings_total_nonnegative",
        ),
    )

    id = db.Column(db.Integer, primary_key=True)

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customers.id"),
        nullable=False,
    )

    car_id = db.Column(
        db.Integer,
        db.ForeignKey("cars.id"),
        nullable=False,
    )

    pickup_location = db.Column(
        db.String(200),
        nullable=False,
    )

    drop_location = db.Column(
        db.String(200),
        nullable=False,
    )

    pickup_datetime = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
    )

    return_datetime = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="pending",
    )

    total_amount = db.Column(
        db.Numeric(10, 2),
        nullable=False,
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

    customer = db.relationship(
        "Customer",
        back_populates="bookings",
    )

    car = db.relationship(
        "Car",
        back_populates="bookings",
    )
