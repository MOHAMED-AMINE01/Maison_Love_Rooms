import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Suite from '../models/Suite';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'djks8n2nh';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'maison_love_rooms';
const MONGO_URI = process.env.MONGO_URI;

const PICS_DIR = path.join(__dirname, '../../../public/new_pics');

const IMAGE_MAPPING = [
  // Love Story
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (9).jpeg', key: 'love-decor', suite: 'Love Story', isMain: true },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21.jpeg', key: 'love-champagne', suite: 'Love Story', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (1).jpeg', key: 'love-hands', suite: 'Love Story', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (2).jpeg', key: 'love-couple-red', suite: 'Love Story', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (4).jpeg', key: 'love-heels', suite: 'Love Story', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (5).jpeg', key: 'love-blindfold', suite: 'Love Story', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (7).jpeg', key: 'love-cocktail', suite: 'Love Story', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (10).jpeg', key: 'love-embrace', suite: 'Love Story', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (11).jpeg', key: 'love-embrace-2', suite: 'Love Story', isMain: false },

  // Baguerra
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (14).jpeg', key: 'baguerra-shower', suite: 'Baguerra', isMain: true },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (12).jpeg', key: 'baguerra-bath', suite: 'Baguerra', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (13).jpeg', key: 'baguerra-couple-bath', suite: 'Baguerra', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (15).jpeg', key: 'baguerra-swing', suite: 'Baguerra', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (17).jpeg', key: 'baguerra-hands', suite: 'Baguerra', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (18).jpeg', key: 'baguerra-handcuffs', suite: 'Baguerra', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (19).jpeg', key: 'baguerra-feather', suite: 'Baguerra', isMain: false },
  { filename: 'WhatsApp Image 2026-07-31 at 09.37.21 (20).jpeg', key: 'baguerra-blindfold', suite: 'Baguerra', isMain: false }
];

async function uploadToCloudinary(filePath: string, publicId: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

  const bodyData = new URLSearchParams();
  bodyData.append('file', base64Data);
  bodyData.append('upload_preset', UPLOAD_PRESET);
  bodyData.append('public_id', publicId);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bodyData.toString()
  });

  const json = await res.json();
  if (!json.secure_url) {
    throw new Error(`Cloudinary upload failed for ${publicId}: ${JSON.stringify(json)}`);
  }
  return json.secure_url;
}

async function run() {
  console.log(`Connexion à MongoDB...`);
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing from environment variables');
  }
  await mongoose.connect(MONGO_URI);
  console.log('Connecté à MongoDB.\n');

  const uploadedUrls: Record<string, string> = {};

  console.log('Début de l\'upload des 17 images vers Cloudinary...');
  for (const item of IMAGE_MAPPING) {
    const fullPath = path.join(PICS_DIR, item.filename);
    console.log(`Upload de "${item.key}" (${item.filename})...`);
    try {
      const url = await uploadToCloudinary(fullPath, `suites/${item.key}`);
      uploadedUrls[item.key] = url;
      console.log(`  ✓ OK: ${url}`);
    } catch (err: any) {
      console.error(`  ✗ ERREUR: ${err.message}`);
    }
  }

  console.log('\n--- URLs Cloudinary générées ---');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  // Sauvegarder le JSON des résultats pour référence
  fs.writeFileSync(
    path.join(__dirname, 'cloudinary_urls.json'),
    JSON.stringify(uploadedUrls, null, 2)
  );

  // Mise à jour de MongoDB
  console.log('\nMise à jour de MongoDB...');
  
  // Love Story
  const loveStoryMain = uploadedUrls['love-decor'];
  const loveStoryGallery = [
    uploadedUrls['love-champagne'],
    uploadedUrls['love-hands'],
    uploadedUrls['love-couple-red'],
    uploadedUrls['love-heels'],
    uploadedUrls['love-blindfold'],
    uploadedUrls['love-cocktail'],
    uploadedUrls['love-embrace'],
    uploadedUrls['love-embrace-2']
  ].filter(Boolean);

  if (loveStoryMain) {
    const updatedLove = await Suite.findOneAndUpdate(
      { name: 'Love Story' },
      { imageUrl: loveStoryMain, images: loveStoryGallery },
      { new: true }
    );
    console.log(`✓ Suite Love Story mise à jour : ${updatedLove ? updatedLove._id : 'Non trouvée'}`);
  }

  // Baguerra
  const baguerraMain = uploadedUrls['baguerra-shower'];
  const baguerraGallery = [
    uploadedUrls['baguerra-bath'],
    uploadedUrls['baguerra-couple-bath'],
    uploadedUrls['baguerra-swing'],
    uploadedUrls['baguerra-hands'],
    uploadedUrls['baguerra-handcuffs'],
    uploadedUrls['baguerra-feather'],
    uploadedUrls['baguerra-blindfold']
  ].filter(Boolean);

  if (baguerraMain) {
    const updatedBaguerra = await Suite.findOneAndUpdate(
      { name: 'Baguerra' },
      { imageUrl: baguerraMain, images: baguerraGallery },
      { new: true }
    );
    console.log(`✓ Suite Baguerra mise à jour : ${updatedBaguerra ? updatedBaguerra._id : 'Non trouvée'}`);
  }

  await mongoose.disconnect();
  console.log('\nProcessus terminé avec succès !');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
