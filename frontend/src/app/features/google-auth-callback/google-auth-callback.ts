
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface GoogleExchangeResponse {
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
  selector: 'app-google-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="callback-page">
      <section class="callback-card">
        <h1>REMEH</h1>

        <p *ngIf="!errorMessage">
          Completing your Google sign-in...
        </p>

        <p *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button
          *ngIf="errorMessage"
          type="button"
          (click)="goToLogin()"
        >
          Back to Login
        </button>
      </section>
    </main>
  `,
  styles: [`
    .callback-page {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .callback-card {
      width: 100%;
      max-width: 420px;
      padding: 32px;
      text-align: center;
      border: 1px solid #e0e5ed;
      border-radius: 14px;
      background: white;
      color: #061e40;
    }

    .error-message {
      color: #b42318;
    }

    button {
      padding: 12px 20px;
      border: 0;
      border-radius: 6px;
      background: #061e40;
      color: white;
      cursor: pointer;
    }
  `],
})
export class GoogleAuthCallback implements OnInit {
  errorMessage = '';

  private readonly apiUrl =
    'http://127.0.0.1:5000/api/auth/google/exchange';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);

    // Remove the temporary code from the visible browser URL.
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search,
    );

    const error = params.get('error');
    const code = params.get('code');

    if (error) {
      this.errorMessage = this.getErrorMessage(error);
      return;
    }

    if (!code) {
      this.errorMessage =
        'The Google login code is missing. Please try again.';
      return;
    }

    this.http.post<GoogleExchangeResponse>(this.apiUrl, { code })
      .subscribe({
        next: (response) => {
          localStorage.setItem(
            'remeh_access_token',
            response.access_token,
          );

          localStorage.setItem(
            'remeh_customer',
            JSON.stringify(response.customer),
          );

          void this.router.navigate(['/']);
        },
        error: (errorResponse) => {
          this.errorMessage =
            errorResponse.error?.error ||
            'Google sign-in failed. Please try again.';
        },
      });
  }

  goToLogin(): void {
    void this.router.navigate(['/login']);
  }

  private getErrorMessage(error: string): string {
    switch (error) {
      case 'account_exists':
        return 'An account already exists with this email. Please sign in with your password.';
      case 'google_email_not_verified':
        return 'Google could not verify your email address.';
      case 'google_profile_unavailable':
        return 'Unable to retrieve your Google account details.';
      default:
        return 'Google sign-in failed. Please try again.';
    }
  }
}
