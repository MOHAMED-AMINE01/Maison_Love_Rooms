import { Suite } from './types';

export const SUITES: Suite[] = [
  {
    id: "luna",
    name: "Luna d'Argento",
    description: "Une symphonie de marbre veiné et de reflets argentés. Conçue pour ceux qui cherchent la sérénité dans un minimalisme précieux.",
    price: 245,
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=2574&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2670&auto=format&fit=crop",
    features: ["Baignoire Îlot", "Eclairage Biodynamique", "Literie Nuage", "Sound System HD"],
  },
  {
    id: "velours",
    name: "Le Boudoir Velours",
    description: "L'intimité du rouge carmin et la chaleur des matières nobles. Un écrin feutré dédié à la passion et à la déconnexion.",
    price: 290,
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2670&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1591088398332-8a77dba993bc?q=80&w=2574&auto=format&fit=crop",
    features: ["Spa Privatif", "Miroirs de Murano", "Mini-bar Vintage", "Dressing de Soie"],
  },
  {
    id: "imperial",
    name: "L'Impériale",
    description: "Notre suite la plus majestueuse. Entre patrimoine et modernité, elle offre un volume spectaculaire sous les toits de Paris.",
    price: 420,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2670&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2549&auto=format&fit=crop",
    features: ["Piscine Intérieure", "Vue Toits de Paris", "Double Douche Pluie", "Smart Automation"],
  },
  {
    id: "zen",
    name: "Jardin de Zen",
    description: "Un espace organique où le bois brûlé rencontre la pierre naturelle. Un retour aux sources dans un luxe brut et apaisant.",
    price: 260,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2670&auto=format&fit=crop",
    fallback: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2600&auto=format&fit=crop",
    features: ["Sauna Finlandais", "Mur Végétal", "Aromathérapie", "Yoga Mat Pro"],
  }
];
