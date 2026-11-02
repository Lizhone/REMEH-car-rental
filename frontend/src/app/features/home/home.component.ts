
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  pickupCity = '';
  dropCity = '';
  pickupDate = '';
  returnDate = '';
  pickupTime = '';
  dropTime = '';

  readonly today = (() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  constructor(private router: Router) {}

  searchCars(): void {
    if (
      !this.pickupCity.trim() ||
      !this.dropCity.trim() ||
      !this.pickupDate ||
      !this.returnDate ||
      !this.pickupTime ||
      !this.dropTime
    ) {
      alert('Please fill in all booking details.');
      return;
    }

    if (this.pickupDate < this.today) {
      alert('Pickup date cannot be in the past.');
      return;
    }

    if (this.returnDate <= this.pickupDate) {
      alert('Return date must be after pickup date.');
      return;
    }

    const tripDetails = {
      pickupLocation: this.pickupCity.trim(),
      destination: this.dropCity.trim(),
      pickupDate: this.pickupDate,
      returnDate: this.returnDate,
      pickupTime: this.pickupTime,
      dropTime: this.dropTime,
      tripType: 'Road Trips',
    };

    sessionStorage.setItem(
      'remehTripDetails',
      JSON.stringify(tripDetails)
    );

    this.router.navigate(['/cars'], {
      queryParams: {
        pickupCity: this.pickupCity.trim(),
        dropCity: this.dropCity.trim(),
        pickupDate: this.pickupDate,
        returnDate: this.returnDate,
        pickupTime: this.pickupTime,
        dropTime: this.dropTime,
      },
    });
  }
}
