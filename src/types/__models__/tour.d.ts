export interface Tour {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "medium" | "difficult";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  created_at: string;
  startDates?: string[];
  secretTour: boolean;
  startLocation?: {
    type: string;
    coordinates: number[];
    address: string;
    description: string;
  };
  locations?: {
    type: string;
    coordinates: number[];
    address: string;
    description: string;
    day: number;
  }[];
  guides?: number[];
  reviews?: Review[];
}
