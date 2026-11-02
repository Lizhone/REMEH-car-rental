export interface BookingRequest {
  customer_id?: number;
  car_id: number;
  pickup_location: string;
  drop_location: string;
  pickup_datetime: string;
  return_datetime: string;
}

export interface BookingResponse {
  message: string;
  status: 'not_implemented';
}
