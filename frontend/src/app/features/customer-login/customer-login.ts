
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface LoginResponse {
  message: string;
  access_token: string;
  customer: {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    auth_provider: string;
  };
}

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-login.html',
  styleUrl: './customer-login.css',
})
export class CustomerLogin {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  private readonly apiUrl = 'http://127.0.0.1:5000/api/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
  
  continueWithGoogle(): void {
    this.errorMessage = '';
    window.location.href = 'http://127.0.0.1:5000/api/auth/google';
  }


  onSubmit(): void {
    this.errorMessage = '';

    const email = this.email.trim().toLowerCase();

    if (!email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;

    this.http.post<LoginResponse>(this.apiUrl, {
      email,
      password: this.password,
    }).subscribe({
      next: (response) => {
        // Store the token for authenticated API requests.
        localStorage.setItem('remeh_access_token', response.access_token);
        localStorage.setItem(
          'remeh_customer',
          JSON.stringify(response.customer),
        );

        this.isLoading = false;
        void this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error.status === 0
            ? 'Unable to connect to the server. Please try again.'
            : error.error?.error || 'Login failed. Please try again.';
      },
    });
  }
}
