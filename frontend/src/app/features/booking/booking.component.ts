
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface Car {
  id: string;
  name: string;
  year: number;
  price: number;
  image: string;
}

interface TripDetails {
  pickupLocation: string;
  destination: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  dropTime: string;
  tripType: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  car: Car | undefined;

  fullName = '';
  email = '';
  phone = '';
  licence = '';

  pickupLocation = '';
  destination = '';
  pickupDate = '';
  returnDate = '';
  pickupTime = '';
  dropTime = '';
  tripType = '';

  errorMessage = '';

  private readonly tripStorageKey = 'remehTripDetails';

  private readonly cars: Car[] = [
    {
      id: 'rolls-royce-silver-dawn',
      name: 'Rolls-Royce Silver Dawn',
      year: 1952,
      price: 12000,
      image: '/images/1952-rolls-royce-silver-dawn_1.png'
    },
    {
      id: 'ferrari-250-gto',
      name: 'Ferrari 250 GTO',
      year: 1962,
      price: 15000,
      image: '/images/1962-ferrari-250-gto_1.png'
    },
    {
      id: 'cobra-alloy',
      name: 'AC Cobra',
      year: 1965,
      price: 11000,
      image: '/images/1965-cobra-alloy-thumb-960xauto-46152.png'
    },
    {
      id: 'detomaso-pantera',
      name: 'De Tomaso Pantera',
      year: 1972,
      price: 10000,
      image: '/images/1972-detomaso-pantera-a.png'
    },
    {
      id: 'chevrolet-fleetmaster',
      name: 'Chevrolet Fleetmaster',
      year: 1948,
      price: 8500,
      image: '/images/Chevrolet-Fleetmaster-1160x773.png'
    },
    {
      id: 'emerald-roadster',
      name: 'Emerald Roadster',
      year: 1930,
      price: 9000,
      image: '/images/Emerald Roadster Overlooking the Valley.png'
    },
    {
      id: 'hindustan-ambassador',
      name: 'Hindustan Ambassador',
      year: 1970,
      price: 5000,
      image: '/images/HindustanAmbassado.png'
    },
    {
      id: 'classic-car-8',
      name: 'Vintage Classic',
      year: 1960,
      price: 6500,
      image: '/images/images (1).png'
    },
    {
      id: 'classic-car-9',
      name: 'Classic Roadster',
      year: 1965,
      price: 7500,
      image: '/images/images.png'
    },
    {
      id: 'jaguar-e-type',
      name: 'Jaguar E-Type',
      year: 1961,
      price: 10000,
      image: '/images/jaguar_e_type_2.png'
    },
    {
      id: 'vintage-touring-car',
      name: 'Vintage Touring Car',
      year: 1955,
      price: 7000,
      image: '/images/vintage touring car.png'
    },
    {
      id: 'royal-white',
      name: 'Royal White Convertible',
      year: 1960,
      price: 8000,
      image: '/images/Royal white.png'
    },
    {
      id: 'shelby-cobra',
      name: 'Shelby Cobra',
      year: 1965,
      price: 11000,
      image: '/images/shelby-cobra.png'
    },
    {
      id: 'vintage-museum-classic',
      name: 'Vintage Museum Classic',
      year: 1935,
      price: 9000,
      image: '/images/Vintage Museum classic.png'
    },
    {
      id: 'vintage-car',
      name: 'Vintage Touring Roadster',
      year: 1940,
      price: 8500,
      image: '/images/vintage-car.png'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTripDetails();

    this.route.queryParamMap.subscribe(params => {
      const carId = params.get('carId');

      this.car = this.cars.find(item => item.id === carId);

      if (!this.car) {
        this.errorMessage =
          'Please return to the collection and select a vehicle first.';
      }
    });
  }

  private loadTripDetails(): void {
    const savedTrip = sessionStorage.getItem(this.tripStorageKey);

    if (!savedTrip) {
      this.errorMessage =
        'Trip dates were not found. Please start by entering your trip on the homepage.';
      return;
    }

    try {
      const trip = JSON.parse(savedTrip) as Partial<TripDetails>;

      this.pickupLocation = trip.pickupLocation ?? '';
      this.destination = trip.destination ?? '';
      this.pickupDate = trip.pickupDate ?? '';
      this.returnDate = trip.returnDate ?? '';
      this.pickupTime = trip.pickupTime ?? '';
      this.dropTime = trip.dropTime ?? '';
      this.tripType = trip.tripType ?? '';

      if (!this.pickupDate || !this.returnDate) {
        this.errorMessage =
          'Pickup or return date is missing. Please check your homepage trip details.';
      }
    } catch (error) {
      console.error('Unable to read saved trip details:', error);
      this.errorMessage = 'Unable to read your saved trip details.';
    }
  }

  get rentalDays(): number {
    if (!this.pickupDate || !this.returnDate) {
      return 0;
    }

    const pickup = new Date(`${this.pickupDate}T00:00:00`);
    const returned = new Date(`${this.returnDate}T00:00:00`);

    if (
      Number.isNaN(pickup.getTime()) ||
      Number.isNaN(returned.getTime()) ||
      returned <= pickup
    ) {
      return 0;
    }

    return Math.round(
      (returned.getTime() - pickup.getTime()) / 86400000
    );
  }

  get rentalTotal(): number {
    return (this.car?.price ?? 0) * this.rentalDays;
  }

  continueToConfirmation(): void {
    this.errorMessage = '';

    if (!this.car) {
      this.errorMessage = 'Please select a vehicle from the collection.';
      return;
    }

    if (
      !this.fullName.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.licence.trim()
    ) {
      this.errorMessage = 'Please complete all required customer details.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(this.phone.trim())) {
      this.errorMessage = 'Please enter a valid phone number.';
      return;
    }

    if (!this.pickupDate || !this.returnDate) {
      this.errorMessage =
        'Trip dates are missing. Please enter them on the homepage first.';
      return;
    }

    if (this.pickupDate < this.today) {
      this.errorMessage = 'Pickup date cannot be in the past.';
      return;
    }

    if (this.returnDate <= this.pickupDate) {
      this.errorMessage = 'Return date must be after the pickup date.';
      return;
    }

    if (this.rentalDays <= 0) {
      this.errorMessage = 'Unable to calculate the rental duration.';
      return;
    }

    const booking = {
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      licence: this.licence.trim(),

      pickupLocation: this.pickupLocation,
      destination: this.destination,
      pickupDate: this.pickupDate,
      returnDate: this.returnDate,
      pickupTime: this.pickupTime,
      dropTime: this.dropTime,
      tripType: this.tripType,

      carId: this.car.id,
      carName: this.car.name,
      carYear: this.car.year,
      carImage: this.car.image,
      dailyRate: this.car.price,

      duration: this.rentalDays,
      rentalTotal: this.rentalTotal
    };

    sessionStorage.setItem('remehBooking', JSON.stringify(booking));

    this.router.navigate(['/booking/confirm']);
  }

  get today(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
