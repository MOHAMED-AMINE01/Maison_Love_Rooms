import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connecté: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
