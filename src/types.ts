export interface Suite {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  image: string;
  fallback?: string;
  features: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface GiftCard {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}
