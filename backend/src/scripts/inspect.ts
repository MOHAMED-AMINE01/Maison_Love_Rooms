import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Suite from '../models/Suite';
import Service from '../models/Service';
import Formule from '../models/Formule';

dotenv.config();

// Script LECTURE SEULE : inspecte les chambres, prestations et formules en base.
(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connecté.\n');

  const suites = await Suite.find();
  console.log(`=== CHAMBRES (${suites.length}) ===`);
  suites.forEach(s => console.log(`  • "${s.name}"  | prix/nuit: ${s.pricePerNight}  | statut: ${s.status}  | _id: ${s._id}`));

  const services = await Service.find();
  console.log(`\n=== PRESTATIONS / SERVICES (${services.length}) ===`);
  services.forEach(s => console.log(`  • "${s.name}"  | ${s.price}€  | catégorie: "${s.category || '-'}"  | variantes: ${(s.variants || []).length}  | _id: ${s._id}`));

  const formules = await Formule.find();
  console.log(`\n=== FORMULES (${formules.length}) ===`);
  formules.forEach(f => console.log(`  • "${f.name}"  | ${f.price}€  | suite: "${f.suiteName}"  | _id: ${f._id}`));

  await mongoose.disconnect();
  console.log('\nDéconnecté.');
  process.exit(0);
})().catch(err => { console.error('ERREUR:', err.message); process.exit(1); });
