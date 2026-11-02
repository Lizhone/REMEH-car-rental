
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface RegisterResponse {
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
  selector: 'app-customer-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-register.html',
  styleUrl: './customer-register.css',
})
export class CustomerRegister {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private readonly apiUrl = 'http://127.0.0.1:5000/api/auth/register';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const fullName = this.fullName.trim();
    const email = this.email.trim().toLowerCase();
    const phone = this.phone.trim();

    if (!fullName || !email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.http.post<RegisterResponse>(this.apiUrl, {
      full_name: fullName,
      email,
      phone: phone || null,
      password: this.password,
    }).subscribe({
      next: (response) => {
        localStorage.setItem('remeh_access_token', response.access_token);
        localStorage.setItem(
          'remeh_customer',
          JSON.stringify(response.customer),
        );

        this.isLoading = false;
        this.successMessage = 'Account created successfully.';

        void this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.status === 0
            ? 'Unable to connect to the server. Please try again.'
            : error.error?.error || 'Registration failed. Please try again.';
      },
    });
  }
}
