
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';

interface BookingSummary {
  carId: string;
  carName: string;
  carYear: number;
  carImage: string;
  dailyRate: number;
  duration: number;
  rentalTotal: number;
  fullName: string;
  email: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  booking: BookingSummary | null = null;

  paymentMethod: PaymentMethod = 'card';
  cardholderName = '';
  cardNumber = '';
  expiryDate = '';
  cvv = '';
  upiId = '';
  bank = '';
  wallet = '';

  errorMessage = '';
  isProcessing = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedBooking = sessionStorage.getItem('remehBooking');

    if (!savedBooking) {
      this.router.navigate(['/collection']);
      return;
    }

    try {
      this.booking = JSON.parse(savedBooking) as BookingSummary;
    } catch {
      this.router.navigate(['/collection']);
    }
  }

  get totalAmount(): number {
    return this.booking?.rentalTotal ?? 0;
  }

  get formattedPickupDate(): string {
    return this.formatDate(this.booking?.pickupDate);
  }

  get formattedReturnDate(): string {
    return this.formatDate(this.booking?.returnDate);
  }

  private formatDate(value?: string): string {
    if (!value) {
      return 'Not specified';
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  setPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod = method;
    this.errorMessage = '';
  }

  payNow(): void {
    this.errorMessage = '';

    if (!this.booking) {
      this.errorMessage = 'Booking details are unavailable. Please start again.';
      return;
    }

    if (this.totalAmount <= 0) {
      this.errorMessage = 'The rental amount is invalid. Please review your dates.';
      return;
    }

    if (this.paymentMethod === 'card') {
      const digits = this.cardNumber.replace(/\s/g, '');

      if (
        !this.cardholderName.trim() ||
        !/^\d{12,19}$/.test(digits) ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiryDate) ||
        !/^\d{3,4}$/.test(this.cvv)
      ) {
        this.errorMessage = 'Please enter valid card details.';
        return;
      }
    }

    if (this.paymentMethod === 'upi') {
      if (!/^[\w.-]+@[\w.-]+$/.test(this.upiId.trim())) {
        this.errorMessage = 'Please enter a valid UPI ID.';
        return;
      }
    }

    if (this.paymentMethod === 'netbanking' && !this.bank) {
      this.errorMessage = 'Please select your bank.';
      return;
    }

    if (this.paymentMethod === 'wallet' && !this.wallet) {
      this.errorMessage = 'Please select a wallet.';
      return;
    }

    // Demo only: no real payment is taken.
    // Never store card numbers or CVV in sessionStorage.
    const confirmation = {
      bookingId: `REMEH-${Date.now().toString().slice(-8)}`,
      carId: this.booking.carId,
      carName: this.booking.carName,
      carYear: this.booking.carYear,
      carImage: this.booking.carImage,
      fullName: this.booking.fullName,
      email: this.booking.email,
      pickupLocation: this.booking.pickupLocation,
      pickupDate: this.booking.pickupDate,
      returnDate: this.booking.returnDate,
      duration: this.booking.duration,
      rentalTotal: this.totalAmount,
      paymentMethod: this.paymentMethod,
      paymentStatus: 'Demo — not charged',
      createdAt: new Date().toISOString()
    };

    sessionStorage.setItem(
      'remehConfirmation',
      JSON.stringify(confirmation)
    );

    this.router.navigate(['/booking-confirmation']);
  }

  formatCardNumber(): void {
    const digits = this.cardNumber.replace(/\D/g, '').slice(0, 19);
    this.cardNumber = digits.match(/.{1,4}/g)?.join(' ') ?? '';
  }
}
