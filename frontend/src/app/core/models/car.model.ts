export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  daily_rate: number;
  image_url: string | null;
  is_available: boolean;
}
