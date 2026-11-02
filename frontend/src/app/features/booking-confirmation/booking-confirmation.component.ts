import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface BookingConfirmation {
  bookingId: string;
  carId: string;
  carName: string;
  carYear: number;
  carImage: string;
  fullName: string;
  email: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  duration: number;
  rentalTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  confirmation: BookingConfirmation | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedConfirmation = sessionStorage.getItem('remehConfirmation');

    if (!savedConfirmation) {
      this.router.navigate(['/collection']);
      return;
    }

    try {
      this.confirmation = JSON.parse(savedConfirmation) as BookingConfirmation;
    } catch {
      this.router.navigate(['/collection']);
    }
  }

  get formattedPickupDate(): string {
    return this.formatDate(this.confirmation?.pickupDate);
  }

  get formattedReturnDate(): string {
    return this.formatDate(this.confirmation?.returnDate);
  }

  get formattedBookingDate(): string {
    const value = this.confirmation?.createdAt;

    if (!value) {
      return 'Not specified';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Not specified';
    }

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private formatDate(value?: string): string {
    if (!value) {
      return 'Not specified';
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return 'Not specified';
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  get paymentMethodLabel(): string {
    const methods: Record<string, string> = {
      card: 'Credit / Debit Card',
      upi: 'UPI',
      netbanking: 'Net Banking',
      wallet: 'Digital Wallet'
    };

    return methods[this.confirmation?.paymentMethod ?? ''] ?? 'Not specified';
  }

  startNewBooking(): void {
    sessionStorage.removeItem('remehBooking');
    sessionStorage.removeItem('remehConfirmation');
    this.router.navigate(['/collection']);
  }
}