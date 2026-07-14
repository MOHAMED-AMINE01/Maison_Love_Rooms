import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Suite from '../models/Suite';
import Faq from '../models/Faq';
import Formule from '../models/Formule';
import Service from '../models/Service';
import Product from '../models/Product';
import GiftCard from '../models/GiftCard';
import Settings from '../models/Settings';

dotenv.config();

// ---------------------------------------------------------------------------
// Nettoyage typographique du contenu stocké en base (corrections client) :
//   • "Maison love Roms" / "Maison Love Room" → "Maison Love Rooms"
//   • "WIFI" / "Wifi" / "wi fi" → "Wi-Fi"
//   • ".." (ou plus) → "…"
//   • espace(s) avant une virgule → supprimé(s)
//   • espaces multiples → un seul
//   • " & " → " et "  (UNIQUEMENT dans les phrases rédigées, pas les titres)
//
// DRY-RUN par défaut : affiche ce qui changerait sans rien écrire.
// Pour appliquer réellement :  npx ts-node src/scripts/normalizeContent.ts --apply
// ---------------------------------------------------------------------------

const APPLY = process.argv.includes('--apply');

const fixCommon = (input: any): string => {
  if (typeof input !== 'string') return input;
  let t = input;
  t = t.replace(/maison\s+love\s+ro+ms?\b/gi, 'Maison Love Rooms'); // nom de marque
  t = t.replace(/\bwi[\s-]?fi\b/gi, 'Wi-Fi');                        // Wi-Fi
  t = t.replace(/(\b\d{1,2})h(?![0-9a-zA-Zàâ])/g, '$1 h');           // "18h" → "18 h" (pas "11h30" ni "18heures")
  t = t.replace(/\.{2,}/g, '…');                                     // ".." → "…"
  t = t.replace(/\s+,/g, ',');                                       // espace avant virgule
  t = t.replace(/ {2,}/g, ' ');                                      // espaces multiples
  return t;
};

// Phrases rédigées : on remplace aussi " & " par " et " (prudent : entouré d'espaces).
const fixPhrase = (input: any): string => {
  if (typeof input !== 'string') return input;
  return fixCommon(input).replace(/ & /g, ' et ');
};

let changeCount = 0;

const trunc = (s: string) => (s.length > 70 ? s.slice(0, 70) + '…' : s);

// Applique `fn` à un champ ; log + marque modifié si différent.
const applyField = (doc: any, label: string, field: string, fn: (v: any) => string): boolean => {
  const before = doc[field];
  if (typeof before !== 'string' || !before) return false;
  const after = fn(before);
  if (after === before) return false;
  changeCount++;
  console.log(`  [${label}] ${field}:\n      - ${trunc(before)}\n      + ${trunc(after)}`);
  doc[field] = after;
  return true;
};

// Idem pour un champ tableau de strings (features).
const applyArray = (doc: any, label: string, field: string, fn: (v: any) => string): boolean => {
  const arr = doc[field];
  if (!Array.isArray(arr)) return false;
  let touched = false;
  const next = arr.map((v: any) => {
    if (typeof v !== 'string') return v;
    const after = fn(v);
    if (after !== v) {
      changeCount++;
      touched = true;
      console.log(`  [${label}] ${field}[]:\n      - ${trunc(v)}\n      + ${trunc(after)}`);
    }
    return after;
  });
  if (touched) doc[field] = next;
  return touched;
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log(`Connecté.  Mode : ${APPLY ? 'APPLICATION (écriture)' : 'DRY-RUN (aucune écriture)'}\n`);

  // --- Suites (on ne touche pas au champ `name`, référencé par les formules) ---
  console.log('=== SUITES ===');
  for (const s of await Suite.find()) {
    const id = `Suite "${s.name}"`;
    let t = false;
    t = applyField(s, id, 'tagline', fixCommon) || t;
    t = applyField(s, id, 'description', fixPhrase) || t;
    t = applyField(s, id, 'longDescription', fixPhrase) || t;
    t = applyField(s, id, 'presentationTitle', fixCommon) || t;
    t = applyField(s, id, 'atouts', fixPhrase) || t;
    t = applyField(s, id, 'callToAction', fixCommon) || t;
    t = applyArray(s, id, 'features', fixCommon) || t;
    if (t && APPLY) await s.save();
  }

  // --- FAQ ---
  console.log('=== FAQ ===');
  for (const f of await Faq.find()) {
    const id = `Faq`;
    let t = false;
    t = applyField(f, id, 'question', fixPhrase) || t;
    t = applyField(f, id, 'answer', fixPhrase) || t;
    if (t && APPLY) await f.save();
  }

  // --- Formules (on ne touche pas à name / suiteName) ---
  console.log('=== FORMULES ===');
  for (const f of await Formule.find()) {
    const id = `Formule "${f.name}"`;
    let t = false;
    t = applyField(f, id, 'description', fixPhrase) || t;
    t = applyArray(f, id, 'features', fixCommon) || t;
    if (t && APPLY) await f.save();
  }

  // --- Prestations / Services (on ne touche pas à name) ---
  console.log('=== PRESTATIONS ===');
  for (const s of await Service.find()) {
    const id = `Prestation "${s.name}"`;
    let t = false;
    t = applyField(s, id, 'description', fixPhrase) || t;
    t = applyField(s, id, 'category', fixCommon) || t;
    t = applyArray(s, id, 'features', fixCommon) || t;
    if (t && APPLY) await s.save();
  }

  // --- Produits (boutique) ---
  console.log('=== PRODUITS ===');
  for (const p of await Product.find()) {
    const id = `Produit`;
    let t = false;
    t = applyField(p, id, 'name', fixCommon) || t;
    t = applyField(p, id, 'description', fixPhrase) || t;
    if (t && APPLY) await p.save();
  }

  // --- Cartes cadeaux ---
  console.log('=== CARTES CADEAUX ===');
  for (const g of await GiftCard.find()) {
    const id = `Carte cadeau`;
    let t = false;
    t = applyField(g, id, 'name', fixCommon) || t;
    t = applyField(g, id, 'description', fixPhrase) || t;
    t = applyField(g, id, 'badge', fixCommon) || t;
    t = applyField(g, id, 'cta', fixCommon) || t;
    t = applyArray(g, id, 'features', fixCommon) || t;
    if (t && APPLY) await g.save();
  }

  // --- Paramètres (adresse + libellés du tableau comparatif) ---
  console.log('=== PARAMÈTRES ===');
  const settings: any = await Settings.findOne();
  if (settings) {
    let t = false;
    t = applyField(settings, 'Settings', 'address', fixCommon) || t;
    if (Array.isArray(settings.comparisonTable?.rows)) {
      settings.comparisonTable.rows.forEach((r: any) => {
        if (typeof r.label === 'string') {
          const after = fixCommon(r.label);
          if (after !== r.label) {
            changeCount++;
            console.log(`  [Settings] comparisonTable.label:\n      - ${trunc(r.label)}\n      + ${trunc(after)}`);
            r.label = after;
            t = true;
          }
        }
      });
      if (t) settings.markModified('comparisonTable');
    }
    if (t && APPLY) await settings.save();
  }

  console.log(`\n${changeCount} correction(s) ${APPLY ? 'appliquée(s)' : 'détectée(s) (dry-run)'}.`);
  if (!APPLY && changeCount > 0) {
    console.log('→ Pour appliquer : npx ts-node src/scripts/normalizeContent.ts --apply');
  }

  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => { console.error('ERREUR:', err.message); process.exit(1); });
