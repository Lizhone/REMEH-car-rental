
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
}

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent {
  constructor(private router: Router) {}

  cars: Car[] = [
    {
      id: 'rolls-royce-silver-dawn',
      name: 'Rolls-Royce Silver Dawn',
      year: 1952,
      category: 'Luxury Classic',
      price: 12000,
      image: '/images/1952-rolls-royce-silver-dawn_1.png',
      seats: 4,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'ferrari-250-gto',
      name: 'Ferrari 250 GTO',
      year: 1962,
      category: 'Classic Sports',
      price: 15000,
      image: '/images/1962-ferrari-250-gto_1.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'cobra-alloy',
      name: 'AC Cobra',
      year: 1965,
      category: 'Classic Sports',
      price: 11000,
      image: '/images/1965-cobra-alloy-thumb-960xauto-46152.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'detomaso-pantera',
      name: 'De Tomaso Pantera',
      year: 1972,
      category: 'Classic Sports',
      price: 10000,
      image: '/images/1972-detomaso-pantera-a.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'chevrolet-fleetmaster',
      name: 'Chevrolet Fleetmaster',
      year: 1948,
      category: 'Vintage Classic',
      price: 8500,
      image: '/images/Chevrolet-Fleetmaster-1160x773.png',
      seats: 4,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'emerald-roadster',
      name: 'Emerald Roadster',
      year: 1930,
      category: 'Vintage Roadster',
      price: 9000,
      image: '/images/Emerald Roadster Overlooking the Valley.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'hindustan-ambassador',
      name: 'Hindustan Ambassador',
      year: 1970,
      category: 'Classic Sedan',
      price: 5000,
      image: '/images/HindustanAmbassado.png',
      seats: 5,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'classic-car-8',
      name: 'Vintage Classic',
      year: 1960,
      category: 'Classic Collection',
      price: 6500,
      image: '/images/images (1).png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'classic-car-9',
      name: 'Classic Roadster',
      year: 1965,
      category: 'Classic Sports',
      price: 7500,
      image: '/images/images.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'jaguar-e-type',
      name: 'Jaguar E-Type',
      year: 1961,
      category: 'Classic Sports',
      price: 10000,
      image: '/images/jaguar_e_type_2.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'vintage-touring-car',
      name: 'Vintage Touring Car',
      year: 1955,
      category: 'Vintage Classic',
      price: 7000,
      image: '/images/vintage touring car.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'royal-white',
      name: 'Royal White Convertible',
      year: 1960,
      category: 'Vintage Convertible',
      price: 8000,
      image: '/images/Royal white.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'shelby-cobra',
      name: 'Shelby Cobra',
      year: 1965,
      category: 'Classic Sports',
      price: 11000,
      image: '/images/shelby-cobra.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'vintage-museum-classic',
      name: 'Vintage Museum Classic',
      year: 1935,
      category: 'Vintage Classic',
      price: 9000,
      image: '/images/Vintage Museum classic.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    },
    {
      id: 'vintage-car',
      name: 'Vintage Touring Roadster',
      year: 1940,
      category: 'Vintage Roadster',
      price: 8500,
      image: '/images/vintage-car.png',
      seats: 2,
      transmission: 'Manual',
      fuel: 'Petrol'
    }
  ];

  viewCarDetails(carId: string): void {
    this.router.navigate(['/cars', carId]);
  }

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    console.error('Failed to load car image:', image.src);
  }
}
