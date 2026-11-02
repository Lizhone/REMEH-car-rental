
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface BookingDetails {
  fullName: string;
  email: string;
  phone: string;
  licence: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  carId: string;
  carName: string;
  carYear: number;
  carImage: string;
  dailyRate: number;
  duration: number;
  rentalTotal: number;
}

@Component({
  selector: 'app-booking-confirm',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-confirm.component.html',
  styleUrls: ['./booking-confirm.component.css']
})
export class BookingConfirmComponent implements OnInit {
  booking: BookingDetails | null = null;
  errorMessage = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedBooking = sessionStorage.getItem('remehBooking');

    if (!savedBooking) {
      this.errorMessage =
        'No booking details were found. Please select a car and complete the booking form.';
      return;
    }

    try {
      const parsed = JSON.parse(savedBooking) as BookingDetails;

      if (
        !parsed.carId ||
        !parsed.carName ||
        !parsed.pickupDate ||
        !parsed.returnDate ||
        !parsed.fullName
      ) {
        this.errorMessage =
          'Your booking details are incomplete. Please complete the booking form again.';
        return;
      }

      this.booking = parsed;
    } catch {
      this.errorMessage =
        'We could not read your booking details. Please start again.';
    }
  }

  get totalDays(): number {
    if (!this.booking) {
      return 0;
    }

    const start = new Date(`${this.booking.pickupDate}T00:00:00`);
    const end = new Date(`${this.booking.returnDate}T00:00:00`);

    return Math.max(
      0,
      Math.ceil((end.getTime() - start.getTime()) / 86400000)
    );
  }

  get rentalTotal(): number {
    return (this.booking?.dailyRate ?? 0) * this.totalDays;
  }

  formatDate(date: string): string {
    if (!date) {
      return 'Not specified';
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  editDetails(): void {
    if (!this.booking) {
      this.router.navigate(['/collection']);
      return;
    }

    this.router.navigate(['/booking'], {
      queryParams: { carId: this.booking.carId }
    });
  }

  continueToPayment(): void {
    if (!this.booking) {
      return;
    }

    const updatedBooking = {
      ...this.booking,
      duration: this.totalDays,
      rentalTotal: this.rentalTotal
    };

    sessionStorage.setItem(
      'remehBooking',
      JSON.stringify(updatedBooking)
    );

    this.router.navigate(['/payment']);
  }
}
