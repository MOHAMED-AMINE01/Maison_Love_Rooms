import { Suite } from './types';

export const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

export const SUITES: Suite[] = [
  {
    id: "love-story",
    name: "Love Story",
    tagline: "Ambiance Gatsby, élégante et raffinée",
    description: "Une parenthèse enchantée dans un univers inspiré des années folles. Élégance, raffinement et luxe discret définissent cet écrin pensé pour les amoureux en quête d'exception.",
    price: 189,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=2645&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop"
    ],
    features: ["Balnéo Privative", "Douche en duo", "Décoration Chic", "Kitchenette", "Champagne Inclus"],
  },
  {
    id: "baguerra",
    name: "Baguerra",
    tagline: "Ambiance Jungle, immersive et dépaysante",
    description: "Laissez-vous transporter par l'exotisme de la suite Baguerra. Une immersion totale dans un décor végétal luxuriant pour une évasion sauvage et sensuelle au cœur de la ville.",
    price: 189,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=2645&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop"
    ],
    features: ["Spa Privatif", "Décoration Jungle", "Cuisine Indépendante", "Ambiance Immersive", "Champagne Inclus"],
  }
];
