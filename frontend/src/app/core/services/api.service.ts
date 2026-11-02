import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BookingRequest, BookingResponse } from '../models/booking.model';
import { Car } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.baseUrl}/cars`);
  }

  getCar(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.baseUrl}/cars/${id}`);
  }

  createBooking(booking: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.baseUrl}/bookings`, booking);
  }
}
