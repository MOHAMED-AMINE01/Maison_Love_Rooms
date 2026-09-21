import { Suite } from './types';

export const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

export const SUITES: Suite[] = [
  {
    id: "love-story",
    name: "Love Story",
    tagline: "Ambiance Gatsby, élégante et raffinée",
    description: "Une parenthèse enchantée dans un univers inspiré des années folles. Élégance, raffinement et luxe discret définissent cet écrin pensé pour les amoureux en quête d'exception.",
    presentationTitle: "Love Story – Luxe, Glamour & Séduction",
    longDescription: "Bienvenue dans la Love Story, un écrin de raffinement inspiré de l'élégance des Années Folles. Pensée pour les couples en quête d'une expérience unique, cette suite vous plonge dans une atmosphère feutrée où le glamour, le romantisme et la sensualité se rencontrent.\n\nDès votre arrivée, vous serez séduits par les lumières tamisées, les voilages délicats, les touches de noir et de rouge profond ainsi que les détails élégants qui rappellent l'univers prestigieux du célèbre Gatsby. Chaque élément a été imaginé pour créer une ambiance intime, mystérieuse et envoûtante.\n\nProfitez d'un moment de détente absolue dans une baignéo privative avant de vous installer dans le salon cosy, conçu pour favoriser les échanges, la complicité et les instants de partage. Les jeux de lumière, les bougies et le mobilier soigneusement sélectionné offrent un cadre chaleureux propice à l'évasion.\n\nPour enrichir votre expérience, la Love Story dispose également d'équipements dédiés aux amoureux, tels qu'un fauteuil tantra, une balançoire spécialement pensé pour explorer votre complicité dans un environnement élégant, discret et raffiné.\n\nQue vous souhaitiez célébrer un anniversaire, une occasion spéciale, surprendre votre partenaire ou simplement vous offrir une parenthèse à deux, cette suite vous promet une expérience inoubliable où chaque détail invite au lâcher-prise et à la connexion.",
    atouts: "Balnéo privative\nAmbiance inspirée des Années Folles\nÉclairage tamisé et atmosphère romantique\nSalon cosy et intimiste\nFauteuil tantra\nDécoration glamour et élégante\nCadre idéal pour les couples et les occasions spéciales",
    callToAction: "Laissez-vous transporter dans un univers où le luxe, la passion et l'élégance se mêlent pour créer des souvenirs inoubliables.",
    price: 189,
    image: "/photos/love-story-1.jpeg",
    images: [
      "/photos/love-story-6.jpeg",
      "/photos/love-story-2.jpeg",
      "/photos/love-story-3.jpeg",
      "/photos/love-story-5.jpeg",
      "/photos/love-story-4.jpeg"
    ],
    features: ["Balnéo Privative", "Douche en duo", "Décoration Chic", "Kitchenette", "Champagne Inclus"],
  },
  {
    id: "baguerra",
    name: "Baguerra",
    tagline: "Ambiance Jungle, immersive et dépaysante",
    description: "Laissez-vous transporter par l'exotisme de la suite Baguerra. Une immersion totale dans un décor végétal luxuriant pour une évasion sauvage et sensuelle au cœur de la ville.",
    presentationTitle: "Baguerra – Exotisme, Luxe & Sérénité",
    longDescription: "Bienvenue à Baguerra, où l'exotisme rencontre l'élégance. Cette suite est une véritable jungle urbaine, conçue pour les couples en quête d'aventure et de sensualité dans un cadre luxe. Dès votre arrivée, vous serez plongés dans une atmosphère sauvage et envoûtante, loin des contraintes du quotidien.\n\nLa décoration luxuriante de Baguerra crée une immersion totale dans un univers végétal sophistiqué. Des plantes généreuses, des teintes de vert profond et des éléments naturels combinés à des touches minimalistes modernes créent une harmonie parfaite entre nature brute et confort premium.\n\nVous disposerez d'un spa privatif pour vous détendre en toute intimité, d'une cuisine indépendante équipée pour préparer vos repas, et d'une ambiance immersive qui enveloppe chaque instant. Les jeux de lumière tamisée et la musique ambiante renforcent cette sensation d'évasion et de connexion.\n\nChaque détail a été pensé pour créer une expérience sensorielle unique, où le luxe discret règne en maître. Les finitions haut de gamme, les matières nobles et les équipements premium transforment votre séjour en une aventure inoubliable.\n\nQue ce soit pour célébrer un moment spécial, fuir le stress quotidien ou redécouvrir votre partenaire dans un cadre enchanteur, Baguerra vous promet une parenthèse magique où la nature, le luxe et la sensualité se conjuguent harmonieusement.",
    atouts: "Spa privatif\nDécoration jungle luxuriante\nCuisine indépendante équipée\nAmbiance immersive et musicale\nLumières tamisées sophistiquées\nMatières nobles et finitions haut de gamme\nÉquipements premium pour couples en quête d'aventure",
    callToAction: "Laissez-vous transporter dans une jungle d'élégance où chaque moment invite à la détente, la complicité et la redécouverte.",
    price: 189,
    image: "/photos/baguerra-1.jpeg",
    images: [
      "/photos/baguerra-3.jpeg",
      "/photos/baguerra-2.jpeg",
      "/photos/baguerra-4.jpeg",
      "/photos/maison-3.jpeg"
    ],
    features: ["Spa Privatif", "Décoration Jungle", "Cuisine Indépendante", "Ambiance Immersive", "Champagne Inclus"],
  }
];
