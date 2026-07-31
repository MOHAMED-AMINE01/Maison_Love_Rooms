import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Suite from '../models/Suite';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;
const urlsPath = path.join(__dirname, 'cloudinary_urls.json');
const urls = JSON.parse(fs.readFileSync(urlsPath, 'utf8'));

async function run() {
  if (!MONGO_URI) throw new Error('MONGO_URI missing');
  await mongoose.connect(MONGO_URI);
  console.log('Connecté à MongoDB.');

  // Love Story
  const loveStoryMain = urls['love-decor'];
  const loveStoryGallery = [
    urls['love-champagne'],
    urls['love-hands'],
    urls['love-couple-red'],
    urls['love-heels'],
    urls['love-blindfold'],
    urls['love-cocktail'],
    urls['love-embrace'],
    urls['love-embrace-2']
  ];

  const resLove = await Suite.findOneAndUpdate(
    { name: 'Love Story' },
    { imageUrl: loveStoryMain, images: loveStoryGallery },
    { returnDocument: 'after' }
  );
  console.log('✓ Suite Love Story mise à jour dans MongoDB :', resLove?._id);

  // Baguerra (matches 'Baguerra' or 'Jungle Room')
  const baguerraMain = urls['baguerra-shower'];
  const baguerraGallery = [
    urls['baguerra-bath'],
    urls['baguerra-couple-bath'],
    urls['baguerra-swing'],
    urls['baguerra-hands'],
    urls['baguerra-handcuffs'],
    urls['baguerra-feather'],
    urls['baguerra-blindfold']
  ];

  const resBaguerra = await Suite.findOneAndUpdate(
    { name: { $regex: /Baguerra|Jungle Room/i } },
    { name: 'Baguerra', imageUrl: baguerraMain, images: baguerraGallery },
    { returnDocument: 'after' }
  );
  console.log('✓ Suite Baguerra mise à jour dans MongoDB :', resBaguerra?._id, 'Nom :', resBaguerra?.name);

  await mongoose.disconnect();
  console.log('Fin du script.');
}

run().catch(console.error);
