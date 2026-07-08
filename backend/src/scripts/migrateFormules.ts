import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Suite from '../models/Suite';
import Service from '../models/Service';
import Formule from '../models/Formule';

dotenv.config();

// Migration : les 3 offres de séjour saisies dans "Prestations" (ancien modèle
// surchargé) deviennent des Formules rattachées à la chambre "Love story".
// Le "Massage dos" reste une prestation (on lui ajoute juste une catégorie).
const SUITE_NAME = 'Love story';
const MASSAGE_ID = '6a1eeb60ea5d897e2f918a46';

const MAPPING: { id: string; billingType: 'nuit' | 'apres_midi'; isPopular: boolean; order: number }[] = [
  { id: '6a0b5ae2eb637cad321abf34', billingType: 'nuit', isPopular: false, order: 1 }, // Escapade romantique
  { id: '6a0b5ae2eb637cad321abf35', billingType: 'nuit', isPopular: true, order: 2 },  // Évasion premium
  { id: '6a1ee879dd8d48234ee61b9a', billingType: 'apres_midi', isPopular: false, order: 3 }, // Pause à deux
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connecté.\n');

  const suite = await Suite.findOne({ name: SUITE_NAME });
  if (!suite) throw new Error(`Chambre "${SUITE_NAME}" introuvable.`);

  for (const m of MAPPING) {
    const svc = await Service.findById(m.id);
    if (!svc) { console.log(`⚠️  Service ${m.id} introuvable, ignoré.`); continue; }

    const existing = await Formule.findOne({ name: svc.name, suiteName: suite.name });
    if (existing) { console.log(`↷ Formule "${svc.name}" existe déjà, on saute.`); continue; }

    await Formule.create({
      name: svc.name,
      suiteName: suite.name,
      description: svc.description,
      price: svc.price,
      billingType: m.billingType,
      features: svc.features || [],
      imageUrl: svc.imageUrl || suite.imageUrl || '',
      isPopular: m.isPopular,
      status: svc.status || 'actif',
      order: m.order,
    });
    await Service.deleteOne({ _id: svc._id });
    console.log(`✓ "${svc.name}" → Formule (${m.billingType}) rattachée à "${suite.name}", retirée des prestations.`);
  }

  // Le massage reste une prestation : on lui donne une catégorie + unité de tarif.
  const massage = await Service.findById(MASSAGE_ID);
  if (massage) {
    massage.category = 'Massage & Bien-être';
    massage.pricingUnit = 'forfait';
    await massage.save();
    console.log(`✓ "${massage.name}" catégorisé en "Massage & Bien-être".`);
  }

  console.log('\n=== APRÈS MIGRATION ===');
  const formules = await Formule.find();
  console.log(`Formules (${formules.length}):`);
  formules.forEach(f => console.log(`  • "${f.name}" | ${f.price}€ | ${f.billingType} | suite: "${f.suiteName}"`));
  const services = await Service.find();
  console.log(`Prestations (${services.length}):`);
  services.forEach(s => console.log(`  • "${s.name}" | ${s.price}€ | cat: "${s.category || '-'}"`));

  await mongoose.disconnect();
  console.log('\nTerminé.');
  process.exit(0);
})().catch(err => { console.error('ERREUR:', err.message); process.exit(1); });
