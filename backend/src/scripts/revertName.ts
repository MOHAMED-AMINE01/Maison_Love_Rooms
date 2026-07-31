import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Suite from '../models/Suite';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connecté à MongoDB.');

  const res = await Suite.findOneAndUpdate(
    { name: 'Baguerra' },
    { name: 'Jungle Room' },
    { returnDocument: 'after' }
  );
  console.log('✓ Nom remis à "Jungle Room" :', res?._id, '| Nom actuel :', res?.name);

  await mongoose.disconnect();
}

run().catch(console.error);
