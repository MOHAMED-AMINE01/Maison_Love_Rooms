// Catalogue des styles typographiques du site.
//
// Tout le site client utilise les classes Tailwind `font-serif` (titres) et
// `font-sans` (corps), qui résolvent vers les variables CSS `--font-serif` et
// `--font-sans`. Changer un style revient donc simplement à surcharger ces deux
// variables et à charger la police Google correspondante — aucun composant à
// modifier. Géré côté admin via l'onglet « Typographie ».

export interface FontTheme {
  id: string;
  name: string;
  mood: string;
  /** Catégorie d'affichage dans l'admin. */
  category: string;
  /** Valeur appliquée à --font-serif (titres / éléments en serif). */
  serif: string;
  /** Valeur appliquée à --font-sans (corps de texte / interface). */
  sans: string;
  /** URL Google Fonts CSS2 chargeant les deux familles du style. */
  href: string;
}

export const DEFAULT_FONT_THEME = 'heritage';

/** Ordre d'affichage des catégories dans l'onglet admin. */
export const FONT_CATEGORIES = [
  'Élégant & Raffiné',
  'Classique & Littéraire',
  'Caractère & Audace',
  'Moderne & Épuré',
  'Signature & Script',
];

export const FONT_THEMES: FontTheme[] = [
  // ───────────────────────── Élégant & Raffiné ─────────────────────────
  {
    id: 'heritage',
    name: 'Héritage',
    mood: 'Le style actuel — raffiné, élégant et intemporel',
    category: 'Élégant & Raffiné',
    serif: '"Playfair Display", serif',
    sans: '"Outfit", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Outfit:wght@200;300;400;500;600;700&display=swap',
  },
  {
    id: 'moderne',
    name: 'Moderne',
    mood: 'Léger et aéré, une touche contemporaine et fluide',
    category: 'Élégant & Raffiné',
    serif: '"Cormorant Garamond", serif',
    sans: '"Jost", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'delicat',
    name: 'Délicat',
    mood: 'Lignes fines et gracieuses, élégance discrète',
    category: 'Élégant & Raffiné',
    serif: '"Cormorant", serif',
    sans: '"Jost", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'lumineux',
    name: 'Lumineux',
    mood: 'Titres lumineux et nets, corps moderne et clair',
    category: 'Élégant & Raffiné',
    serif: '"Prata", serif',
    sans: '"Work Sans", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Prata&family=Work+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap',
  },
  {
    id: 'parisien',
    name: 'Parisien',
    mood: 'Capitales romaines délicates, esprit haussmannien',
    category: 'Élégant & Raffiné',
    serif: '"Forum", serif',
    sans: '"Jost", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Forum&family=Jost:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'galerie',
    name: 'Galerie',
    mood: 'Haut de gamme et structuré, esprit galerie d\'art',
    category: 'Élégant & Raffiné',
    serif: '"Gilda Display", serif',
    sans: '"Nunito Sans", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Gilda+Display&family=Nunito+Sans:wght@300;400;600;700&display=swap',
  },
  {
    id: 'romantique',
    name: 'Romantique',
    mood: 'Fin et délicat, une douceur féminine',
    category: 'Élégant & Raffiné',
    serif: '"Italiana", serif',
    sans: '"Mulish", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Italiana&family=Mulish:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'raffine',
    name: 'Raffiné',
    mood: 'Plume soignée et lecture confortable',
    category: 'Élégant & Raffiné',
    serif: '"Crimson Pro", serif',
    sans: '"Karla", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Karla:wght@300;400;500;600;700&display=swap',
  },

  // ─────────────────────── Classique & Littéraire ──────────────────────
  {
    id: 'editorial',
    name: 'Éditorial',
    mood: 'Esprit magazine, lecture posée et confiante',
    category: 'Classique & Littéraire',
    serif: '"Libre Baskerville", serif',
    sans: '"Inter", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'classique',
    name: 'Classique',
    mood: 'Sobre et chaleureux, une valeur sûre',
    category: 'Classique & Littéraire',
    serif: '"EB Garamond", serif',
    sans: '"Lato", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lato:wght@300;400;700;900&display=swap',
  },
  {
    id: 'serein',
    name: 'Serein',
    mood: 'Équilibré et lisible, parfait pour les longs textes',
    category: 'Classique & Littéraire',
    serif: '"Lora", serif',
    sans: '"Source Sans 3", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'journal',
    name: 'Journal',
    mood: 'Robuste et sérieux, autorité éditoriale',
    category: 'Classique & Littéraire',
    serif: '"Merriweather", serif',
    sans: '"Montserrat", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;0,900;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'intemporel',
    name: 'Intemporel',
    mood: 'Humaniste et classique, jamais démodé',
    category: 'Classique & Littéraire',
    serif: '"Cardo", serif',
    sans: '"Lato", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap',
  },
  {
    id: 'gazette',
    name: 'Gazette',
    mood: 'Net et carré, esprit presse contemporaine',
    category: 'Classique & Littéraire',
    serif: '"PT Serif", serif',
    sans: '"Inter", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'sobre',
    name: 'Sobre',
    mood: 'Ferme et posé, sérieux sans rigidité',
    category: 'Classique & Littéraire',
    serif: '"Domine", serif',
    sans: '"Source Sans 3", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Domine:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'patrimoine',
    name: 'Patrimoine',
    mood: 'Inspiration livre ancien, caractère patiné',
    category: 'Classique & Littéraire',
    serif: '"Old Standard TT", serif',
    sans: '"Lato", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap',
  },
  {
    id: 'precieux',
    name: 'Précieux',
    mood: 'Contemporain et soigné, touche éditoriale chic',
    category: 'Classique & Littéraire',
    serif: '"Frank Ruhl Libre", serif',
    sans: '"Assistant", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700;900&family=Assistant:wght@300;400;500;600;700&display=swap',
  },

  // ───────────────────────── Caractère & Audace ────────────────────────
  {
    id: 'contemporain',
    name: 'Contemporain',
    mood: 'Contraste fort et affirmé, très haute couture',
    category: 'Caractère & Audace',
    serif: '"Bodoni Moda", serif',
    sans: '"Manrope", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500&family=Manrope:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'audacieux',
    name: 'Audacieux',
    mood: 'Titres dramatiques et marquants, beaucoup de caractère',
    category: 'Caractère & Audace',
    serif: '"DM Serif Display", serif',
    sans: '"DM Sans", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap',
  },
  {
    id: 'opulent',
    name: 'Opulent',
    mood: 'Capitales gravées et majestueuses, prestige absolu',
    category: 'Caractère & Audace',
    serif: '"Cinzel", serif',
    sans: '"Raleway", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap',
  },
  {
    id: 'couture',
    name: 'Couture',
    mood: 'Titres pleins et spectaculaires, signature mode',
    category: 'Caractère & Audace',
    serif: '"Abril Fatface", serif',
    sans: '"Poppins", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Poppins:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'velours',
    name: 'Velours',
    mood: 'Empattements généreux et sensuels, chaleur feutrée',
    category: 'Caractère & Audace',
    serif: '"Rozha One", serif',
    sans: '"Mulish", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Rozha+One&family=Mulish:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'monogramme',
    name: 'Monogramme',
    mood: 'Titres compacts et affirmés, allure de label',
    category: 'Caractère & Audace',
    serif: '"Yeseva One", serif',
    sans: '"Lato", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Yeseva+One&family=Lato:wght@300;400;700;900&display=swap',
  },
  {
    id: 'caractere',
    name: 'Caractère',
    mood: 'Solide et expressif, présence assumée',
    category: 'Caractère & Audace',
    serif: '"Vollkorn", serif',
    sans: '"Work Sans", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Work+Sans:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'brut',
    name: 'Brut',
    mood: 'Titres ultra-gras et impactants, modernité brute',
    category: 'Caractère & Audace',
    serif: '"Archivo Black", sans-serif',
    sans: '"Archivo", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@300;400;500;600;700&display=swap',
  },

  // ───────────────────────── Moderne & Épuré ───────────────────────────
  {
    id: 'chic',
    name: 'Chic',
    mood: 'Romain gravé et net, prestige discret',
    category: 'Moderne & Épuré',
    serif: '"Marcellus", serif',
    sans: '"Poppins", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Marcellus&family=Poppins:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'naturel',
    name: 'Naturel',
    mood: 'Organique et apaisant, lecture tout en souplesse',
    category: 'Moderne & Épuré',
    serif: '"Spectral", serif',
    sans: '"Karla", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Karla:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'boutique',
    name: 'Boutique',
    mood: 'Sans-serif épuré et chic, minimalisme élégant',
    category: 'Moderne & Épuré',
    serif: '"Tenor Sans", sans-serif',
    sans: '"Poppins", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Poppins:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'epure',
    name: 'Épuré',
    mood: 'Géométrique et léger, allure scandinave',
    category: 'Moderne & Épuré',
    serif: '"Josefin Sans", sans-serif',
    sans: '"Mulish", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&family=Mulish:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'graphique',
    name: 'Graphique',
    mood: 'Moderne et technique, personnalité affirmée',
    category: 'Moderne & Épuré',
    serif: '"Space Grotesk", sans-serif',
    sans: '"Inter", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'arrondi',
    name: 'Arrondi',
    mood: 'Doux et accueillant, formes rondes et amicales',
    category: 'Moderne & Épuré',
    serif: '"Quicksand", sans-serif',
    sans: '"Nunito", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'tech',
    name: 'Tech',
    mood: 'Net, contemporain et pro, esprit start-up premium',
    category: 'Moderne & Épuré',
    serif: '"Sora", sans-serif',
    sans: '"Inter", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'premium',
    name: 'Premium',
    mood: 'Sans-serif moderne et soigné, cohérence parfaite',
    category: 'Moderne & Épuré',
    serif: '"Plus Jakarta Sans", sans-serif',
    sans: '"Plus Jakarta Sans", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap',
  },

  // ───────────────────────── Signature & Script ────────────────────────
  {
    id: 'calligraphie',
    name: 'Calligraphie',
    mood: 'Titres manuscrits raffinés — décoratif, à réserver aux grands titres',
    category: 'Signature & Script',
    serif: '"Great Vibes", cursive',
    sans: '"Jost", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Jost:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'idylle',
    name: 'Idylle',
    mood: 'Écriture romantique et fluide, accent très féminin',
    category: 'Signature & Script',
    serif: '"Parisienne", cursive',
    sans: '"Mulish", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Parisienne&family=Mulish:wght@300;400;500;600;700&display=swap',
  },
  {
    id: 'fleur',
    name: 'Fleur',
    mood: 'Plume calligraphiée et précieuse, charme couture',
    category: 'Signature & Script',
    serif: '"Pinyon Script", cursive',
    sans: '"Lato", sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Lato:wght@300;400;700&display=swap',
  },
];

const ACTIVE_FONT_LINK_ID = 'dynamic-font-theme';
const CACHE_KEY = 'siteFontTheme';

export function getFontTheme(id: string | undefined | null): FontTheme {
  return FONT_THEMES.find((t) => t.id === id) || FONT_THEMES[0];
}

/**
 * Applique un style typographique à tout le document : charge la police Google
 * du style puis surcharge --font-serif / --font-sans. Chaque utilitaire
 * `font-serif` / `font-sans` du site se met à jour instantanément.
 */
export function applyFontTheme(id: string): void {
  if (typeof document === 'undefined') return;
  const theme = getFontTheme(id);

  let link = document.getElementById(ACTIVE_FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = ACTIVE_FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.getAttribute('href') !== theme.href) link.href = theme.href;

  const root = document.documentElement;
  root.style.setProperty('--font-serif', theme.serif);
  root.style.setProperty('--font-sans', theme.sans);

  try {
    localStorage.setItem(CACHE_KEY, theme.id);
  } catch {
    /* localStorage indisponible — ignoré */
  }
}

/** Dernier style appliqué, mémorisé localement pour éviter tout flash au chargement. */
export function getCachedFontTheme(): string {
  try {
    return localStorage.getItem(CACHE_KEY) || DEFAULT_FONT_THEME;
  } catch {
    return DEFAULT_FONT_THEME;
  }
}

/** Charge les polices de tous les styles (pour les aperçus de l'onglet admin). */
export function preloadAllThemeFonts(): void {
  if (typeof document === 'undefined') return;
  for (const theme of FONT_THEMES) {
    const id = `theme-font-${theme.id}`;
    if (document.getElementById(id)) continue;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = theme.href;
    document.head.appendChild(link);
  }
}
