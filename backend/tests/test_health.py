from app import create_app


def test_health_endpoint_returns_api_status():
    app = create_app()
    app.config.update(TESTING=True)

    response = app.test_client().get("/api/health")

    assert response.status_code == 200
    assert response.get_json() == {
        "status": "ok",
        "message": "REMEH API is running",
    }


def test_booking_endpoint_validates_payload_without_creating_booking():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    invalid_response = client.post("/api/bookings", json={"car_id": 1})
    assert invalid_response.status_code == 400
    assert invalid_response.get_json()["error"] == "missing_fields"

    valid_response = client.post(
        "/api/bookings",
        json={
            "car_id": 1,
            "pickup_location": "City A",
            "drop_location": "City B",
            "pickup_datetime": "2026-11-01T10:00:00Z",
            "return_datetime": "2026-11-02T10:00:00Z",
        },
    )
    assert valid_response.status_code == 501
    assert valid_response.get_json()["status"] == "not_implemented"
