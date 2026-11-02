
from flask import Blueprint, jsonify
from sqlalchemy import select

from app.extensions import db
from app.models.car import Car

cars_bp = Blueprint("cars", __name__)


def serialize_car(car: Car) -> dict:
    return {
        "id": car.slug,
        "slug": car.slug,
        "name": f"{car.make} {car.model}",
        "make": car.make,
        "model": car.model,
        "year": car.year,
        "category": car.category,
        "price": float(car.daily_rate),
        "daily_rate": float(car.daily_rate),
        "image": car.image_url,
        "image_url": car.image_url,
        "seats": car.seats,
        "transmission": car.transmission,
        "fuel": car.fuel_type,
        "fuel_type": car.fuel_type,
        "is_available": car.is_available,
    }


@cars_bp.get("/cars")
def list_cars():
    statement = select(Car).order_by(Car.year.asc())
    cars = db.session.execute(statement).scalars().all()

    return jsonify([serialize_car(car) for car in cars]), 200


@cars_bp.get("/cars/<string:car_slug>")
def get_car(car_slug: str):
    statement = select(Car).where(Car.slug == car_slug)
    car = db.session.execute(statement).scalar_one_or_none()

    if car is None:
        return jsonify({
            "error": "car_not_found",
            "message": f"Car '{car_slug}' was not found.",
        }), 404

    return jsonify(serialize_car(car)), 200
