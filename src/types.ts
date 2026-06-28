export interface Suite {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  presentationTitle?: string;
  atouts?: string;
  callToAction?: string;
  price: number;
  image: string;
  images?: string[];
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
