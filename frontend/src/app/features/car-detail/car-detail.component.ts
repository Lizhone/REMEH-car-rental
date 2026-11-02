
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface CarDetail {
  id: string;
  name: string;
  year: number;
  category: string;
  price: number;
  image: string;
  seats: number;
  transmission: string;
  fuel: string;
  bodyStyle: string;
  description: string;
}

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {
  car: CarDetail | undefined;
  isCompared = false;

  private readonly cars: CarDetail[] = [
    {
      id: 'rolls-royce-silver-dawn',
      name: 'Rolls-Royce Silver Dawn',
      year: 1952,
      category: 'Luxury Classic',
      price: 12000,
      image: '/images/1952-rolls-royce-silver-dawn_1.png',
      seats: 4,
      transmission: 'Manual',
      fuel: 'Petrol',
      bodyStyle: 'Luxury Convertible',
      description: 'A distinguished classic automobile with elegant styling and timeless road presence. Ideal for leisurely scenic drives and memorable occasions.'
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
      fuel: 'Petrol',
      bodyStyle: 'Sports Coupe',
      description: 'A celebrated vintage sports-car design with sculpted lines and an unmistakable motorsport character. Made for enthusiasts who appreciate automotive history.'
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
      fuel: 'Petrol',
      bodyStyle: 'Roadster',
      description: 'A bold roadster with muscular proportions and a classic open-top silhouette. A distinctive choice for a memorable weekend drive.'
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
      fuel: 'Petrol',
      bodyStyle: 'Sports Coupe',
      description: 'A striking Italian-designed sports car known for its low profile and dramatic styling. Its angular silhouette brings a distinctive seventies character to the collection.'
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
      fuel: 'Petrol',
      bodyStyle: 'Classic Coupe',
      description: 'A post-war American classic with rounded bodywork and period charm. A relaxed choice for nostalgic drives and special outings.'
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
      fuel: 'Petrol',
      bodyStyle: 'Roadster',
      description: 'A vintage-inspired roadster presented with an elegant open-top profile. Suited to scenic routes, photographs, and slow drives through beautiful landscapes.'
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
      fuel: 'Petrol',
      bodyStyle: 'Sedan',
      description: 'An iconic Indian motoring classic recognised for its unmistakable shape and spacious cabin. A nostalgic option for relaxed city tours and family outings.'
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
      fuel: 'Petrol',
      bodyStyle: 'Classic Coupe',
      description: 'A timeless classic selected for its distinctive appearance and vintage character. A memorable companion for a leisurely drive.'
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
      fuel: 'Petrol',
      bodyStyle: 'Roadster',
      description: 'A stylish classic with an open-road spirit and an unmistakably vintage look. Enjoy the character of a different era behind the wheel.'
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
      fuel: 'Petrol',
      bodyStyle: 'Sports Coupe',
      description: 'An elegant British sports-car design celebrated for its long bonnet and flowing lines. A sophisticated choice for scenic drives and special occasions.'
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
      fuel: 'Petrol',
      bodyStyle: 'Touring Car',
      description: 'A vintage touring-style vehicle with a distinctive period silhouette. Perfect for a nostalgic journey and a different kind of driving experience.'
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
      fuel: 'Petrol',
      bodyStyle: 'Convertible',
      description: 'A graceful white convertible with a classic profile and elegant presence. A lovely choice for open-air journeys and memorable photographs.'
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
      fuel: 'Petrol',
      bodyStyle: 'Roadster',
      description: 'A celebrated performance-inspired roadster with a muscular stance and timeless proportions. Created for those drawn to bold classic-car styling.'
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
      fuel: 'Petrol',
      bodyStyle: 'Vintage Touring',
      description: 'A pre-war-inspired classic with traditional bodywork and period detailing. A distinctive choice for themed drives and vintage-car enthusiasts.'
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
      fuel: 'Petrol',
      bodyStyle: 'Roadster',
      description: 'A traditional vintage roadster with an elegant silhouette and old-world appeal. Enjoy a slower, more characterful journey in a classic style.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.car = this.cars.find(item => item.id === id);
      this.isCompared = false;
    });
  }

  goBack(): void {
    this.router.navigate(['/collection']);
  }

  toggleCompare(): void {
    this.isCompared = !this.isCompared;
  }

  selectCar(): void {
  if (!this.car) {
    return;
  }

  this.router.navigate(['/booking'], {
    queryParams: { carId: this.car.id }
  });
}

  handleImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    console.error('Failed to load car detail image:', image.src);
  }
}
