
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Car {
  id: string;
  name: string;
  year: number;
  category: string;
  price: number;
  image: string;
  seats: number;
  transmission: string;
  fuel: string;
  is_available: boolean;
}

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  isLoading = true;
  errorMessage = '';

  private readonly apiUrl = 'http://127.0.0.1:5000/api/cars';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Car[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.cars = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load cars:', error);
        this.errorMessage =
          'Unable to load the car collection. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  viewCarDetails(carId: string): void {
  this.router.navigate(['/cars', carId]);
}

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    console.error('Failed to load car image:', image.src);
  }
}
