import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  status: 'actif' | 'inactif';
  features?: string[];
  isPopular?: boolean;
  billingType: 'par_nuit' | 'forfait';
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    status: {
      type: String,
      enum: ['actif', 'inactif'],
      default: 'actif',
    },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    billingType: {
      type: String,
      enum: ['par_nuit', 'forfait'],
      default: 'par_nuit',
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;
