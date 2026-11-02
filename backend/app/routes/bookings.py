from datetime import datetime

from flask import Blueprint, jsonify, request

bookings_bp = Blueprint("bookings", __name__)

REQUIRED_FIELDS = {
    "car_id",
    "pickup_location",
    "drop_location",
    "pickup_datetime",
    "return_datetime",
}


def _parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


@bookings_bp.post("/bookings")
def create_booking():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "invalid_json", "message": "A JSON object is required."}), 400

    missing_fields = sorted(REQUIRED_FIELDS - payload.keys())
    if missing_fields:
        return jsonify(
            {
                "error": "missing_fields",
                "message": "Required booking fields are missing.",
                "fields": missing_fields,
            }
        ), 400

    car_id = payload["car_id"]
    if isinstance(car_id, bool) or not isinstance(car_id, int) or car_id < 1:
        return jsonify({"error": "invalid_car_id", "message": "car_id must be a positive integer."}), 400

    for field in ("pickup_location", "drop_location"):
        if not isinstance(payload[field], str) or not payload[field].strip():
            return jsonify(
                {"error": "invalid_field", "message": f"{field} must be a non-empty string."}
            ), 400

    try:
        pickup = _parse_datetime(payload["pickup_datetime"])
        returned = _parse_datetime(payload["return_datetime"])
    except (AttributeError, TypeError, ValueError):
        return jsonify(
            {
                "error": "invalid_datetime",
                "message": "pickup_datetime and return_datetime must be ISO 8601 strings.",
            }
        ), 400

    if returned <= pickup:
        return jsonify(
            {"error": "invalid_date_range", "message": "return_datetime must be after pickup_datetime."}
        ), 400

    customer_id = payload.get("customer_id")
    if customer_id is not None and (
        isinstance(customer_id, bool) or not isinstance(customer_id, int) or customer_id < 1
    ):
        return jsonify(
            {"error": "invalid_customer_id", "message": "customer_id must be a positive integer."}
        ), 400

    return jsonify(
        {
            "status": "not_implemented",
            "message": "Booking request is valid, but booking creation is not implemented yet.",
        }
    ), 501
