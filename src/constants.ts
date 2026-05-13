import { Suite } from './types';

export const SUITES: Suite[] = [
  {
    id: "love-story",
    name: "Love Story",
    tagline: "Ambiance Gatsby, élégante et raffinée",
    description: "Une parenthèse enchantée dans un univers inspiré des années folles. Élégance, raffinement et luxe discret définissent cet écrin pensé pour les amoureux en quête d'exception.",
    price: 189,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2000&auto=format&fit=crop",
    features: ["Balnéo Privative", "Douche en duo", "Décoration Chic", "Kitchenette", "Champagne Inclus"],
  },
  {
    id: "baguerra",
    name: "Baguerra",
    tagline: "Ambiance Jungle, immersive et dépaysante",
    description: "Laissez-vous transporter par l'exotisme de la suite Baguerra. Une immersion totale dans un décor végétal luxuriant pour une évasion sauvage et sensuelle au cœur de la ville.",
    price: 189,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2000&auto=format&fit=crop",
    features: ["Spa Privatif", "Décoration Jungle", "Cuisine Indépendante", "Ambiance Immersive", "Champagne Inclus"],
  }
];
