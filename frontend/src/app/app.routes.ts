import { Routes } from '@angular/router';

import { FeaturePlaceholderComponent } from './shared/components/feature-placeholder/feature-placeholder.component';

import { HomeComponent } from './features/home/home.component';
import { CarsComponent } from './features/cars/cars.component';
import { CarDetailComponent } from './features/car-detail/car-detail.component';

import { BookingComponent } from './features/booking/booking.component';
import { BookingConfirmComponent } from './features/booking-confirm/booking-confirm.component';
import { PaymentComponent } from './features/payment/payment.component';
import { BookingConfirmationComponent } from './features/booking-confirmation/booking-confirmation.component';
import { CustomerLogin } from './features/customer-login/customer-login';
import { CustomerRegister } from './features/customer-register/customer-register';
import { GoogleAuthCallback } from './features/google-auth-callback/google-auth-callback';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'REMEH | Premium Car Rental'
  },
  {
    path: 'cars',
    component: CarsComponent,
    title: 'Available Vintage Cars | REMEH'
  },
  {
    path: 'collection',
    component: CarsComponent,
    title: 'Our Collection | REMEH'
  },
  {
    path: 'cars/:id',
    component: CarDetailComponent,
    title: 'Car Details | REMEH'
  },

  // Step 1: Enter customer and rental details
  {
    path: 'booking',
    component: BookingComponent,
    title: 'Enter Your Details | REMEH'
  },

  // Step 2: Review booking details
  {
    path: 'booking/confirm',
    component: BookingConfirmComponent,
    title: 'Review Your Booking | REMEH'
  },

  // Step 3: Payment
  {
    path: 'payment',
    component: PaymentComponent,
    title: 'Payment | REMEH'
  },

  // Step 4: Final booking confirmation
  {
    path: 'booking-confirmation',
    component: BookingConfirmationComponent,
    title: 'Booking Confirmed | REMEH'
  },

  // Other pages
  {
    path: 'my-bookings',
    component: FeaturePlaceholderComponent,
    data: {
      title: 'My Bookings',
      description: 'Manage your reservations here.'
    },
    title: 'My Bookings | REMEH'
  },
  {
  path: 'login',
  component: CustomerLogin,
  title: 'Login | REMEH',
},
 {
  path: 'register',
  component: CustomerRegister,
  title: 'Create Your Account | REMEH',
},
 {
  path: 'services',
  component: FeaturePlaceholderComponent,
  data: {
    title: 'Our Services',
    description:
      'Discover the services that make every journey more comfortable.',
    showServices: true,
  },
  title: 'Services | REMEH'
},
  {
  path: 'auth/google/callback',
  component: GoogleAuthCallback,
  title: 'Completing Google Sign-In | REMEH',
},

  // Page not found
  {
    path: '**',
    component: FeaturePlaceholderComponent,
    data: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.'
    },
    title: 'Not Found | REMEH'
  }
];