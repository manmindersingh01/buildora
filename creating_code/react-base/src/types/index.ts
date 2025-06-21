export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  images: string[];
  amenities: string[];
  description: string;
  available: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}