
from decimal import Decimal

from app import create_app
from app.extensions import db
from app.models.car import Car


CARS = [
    {
        "slug": "rolls-royce-silver-dawn",
        "make": "Rolls-Royce",
        "model": "Silver Dawn",
        "year": 1952,
        "category": "Luxury Classic",
        "daily_rate": 12000,
        "image_url": "/images/1952-rolls-royce-silver-dawn_1.png",
        "seats": 4,
    },
    {
        "slug": "ferrari-250-gto",
        "make": "Ferrari",
        "model": "250 GTO",
        "year": 1962,
        "category": "Classic Sports",
        "daily_rate": 15000,
        "image_url": "/images/1962-ferrari-250-gto_1.png",
        "seats": 2,
    },
    {
        "slug": "cobra-alloy",
        "make": "AC",
        "model": "Cobra",
        "year": 1965,
        "category": "Classic Sports",
        "daily_rate": 11000,
        "image_url": "/images/1965-cobra-alloy-thumb-960xauto-46152.png",
        "seats": 2,
    },
    {
        "slug": "detomaso-pantera",
        "make": "De Tomaso",
        "model": "Pantera",
        "year": 1972,
        "category": "Classic Sports",
        "daily_rate": 10000,
        "image_url": "/images/1972-detomaso-pantera-a.png",
        "seats": 2,
    },
    {
        "slug": "chevrolet-fleetmaster",
        "make": "Chevrolet",
        "model": "Fleetmaster",
        "year": 1948,
        "category": "Vintage Classic",
        "daily_rate": 8500,
        "image_url": "/images/Chevrolet-Fleetmaster-1160x773.png",
        "seats": 4,
    },
    {
        "slug": "emerald-roadster",
        "make": "Emerald",
        "model": "Roadster",
        "year": 1930,
        "category": "Vintage Roadster",
        "daily_rate": 9000,
        "image_url": "/images/Emerald Roadster Overlooking the Valley.png",
        "seats": 2,
    },
    {
        "slug": "hindustan-ambassador",
        "make": "Hindustan",
        "model": "Ambassador",
        "year": 1970,
        "category": "Classic Sedan",
        "daily_rate": 5000,
        "image_url": "/images/HindustanAmbassado.png",
        "seats": 5,
    },
    {
        "slug": "classic-car-8",
        "make": "Vintage",
        "model": "Classic",
        "year": 1960,
        "category": "Classic Collection",
        "daily_rate": 6500,
        "image_url": "/images/images (1).png",
        "seats": 2,
    },
    {
        "slug": "classic-car-9",
        "make": "Classic",
        "model": "Roadster",
        "year": 1965,
        "category": "Classic Sports",
        "daily_rate": 7500,
        "image_url": "/images/images.png",
        "seats": 2,
    },
    {
        "slug": "jaguar-e-type",
        "make": "Jaguar",
        "model": "E-Type",
        "year": 1961,
        "category": "Classic Sports",
        "daily_rate": 10000,
        "image_url": "/images/jaguar_e_type_2.png",
        "seats": 2,
    },
    {
        "slug": "vintage-touring-car",
        "make": "Vintage",
        "model": "Touring Car",
        "year": 1955,
        "category": "Vintage Classic",
        "daily_rate": 7000,
        "image_url": "/images/vintage touring car.png",
        "seats": 2,
    },
    {
        "slug": "royal-white",
        "make": "Royal White",
        "model": "Convertible",
        "year": 1960,
        "category": "Vintage Convertible",
        "daily_rate": 8000,
        "image_url": "/images/Royal white.png",
        "seats": 2,
    },
    {
        "slug": "shelby-cobra",
        "make": "Shelby",
        "model": "Cobra",
        "year": 1965,
        "category": "Classic Sports",
        "daily_rate": 11000,
        "image_url": "/images/shelby-cobra.png",
        "seats": 2,
    },
    {
        "slug": "vintage-museum-classic",
        "make": "Vintage Museum",
        "model": "Classic",
        "year": 1935,
        "category": "Vintage Classic",
        "daily_rate": 9000,
        "image_url": "/images/Vintage Museum classic.png",
        "seats": 2,
    },
    {
        "slug": "vintage-car",
        "make": "Vintage",
        "model": "Touring Roadster",
        "year": 1940,
        "category": "Vintage Roadster",
        "daily_rate": 8500,
        "image_url": "/images/vintage-car.png",
        "seats": 2,
    },
]


def seed_cars():
    app = create_app()

    with app.app_context():
        added = 0
        updated = 0

        try:
            for data in CARS:
                car = db.session.execute(
                    db.select(Car).where(Car.slug == data["slug"])
                ).scalar_one_or_none()

                if car is None:
                    car = Car(
                        slug=data["slug"],
                        make=data["make"],
                        model=data["model"],
                        year=data["year"],
                        category=data["category"],
                        transmission="Manual",
                        fuel_type="Petrol",
                        seats=data["seats"],
                        daily_rate=Decimal(str(data["daily_rate"])),
                        image_url=data["image_url"],
                        is_available=True,
                    )
                    db.session.add(car)
                    added += 1
                else:
                    car.make = data["make"]
                    car.model = data["model"]
                    car.year = data["year"]
                    car.category = data["category"]
                    car.transmission = "Manual"
                    car.fuel_type = "Petrol"
                    car.seats = data["seats"]
                    car.daily_rate = Decimal(str(data["daily_rate"]))
                    car.image_url = data["image_url"]

                    updated += 1

            db.session.commit()
            print(f"Seed completed. Added: {added}, updated: {updated}")

        except Exception:
            db.session.rollback()
            raise


if __name__ == "__main__":
    seed_cars()
