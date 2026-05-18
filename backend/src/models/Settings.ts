import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  singletonId: string;
  comparisonTable: {
    label: string;
    e: boolean;
    c: boolean;
    icon?: string;
  }[];
  establishmentName: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  whatsapp: string;
  checkInTime: string;
  checkOutTime: string;
  maxNights: number;
}

const settingsSchema = new Schema<ISettings>({
  singletonId: { type: String, default: 'main', unique: true },
  comparisonTable: [
    {
      label: { type: String, required: true },
      e: { type: Boolean, default: false },
      c: { type: Boolean, default: false },
      icon: { type: String },
    }
  ],
  establishmentName: { type: String, default: 'Maison Love Rooms' },
  email: { type: String, default: 'conciergerie@maisonloveroom.fr' },
  phone: { type: String, default: '+33 1 23 45 67 89' },
  address: { type: String, default: 'Rue des Saints-Pères, 75006 Paris' },
  instagram: { type: String, default: '@maisonloveroom' },
  whatsapp: { type: String, default: '+33 1 23 45 67 89' },
  checkInTime: { type: String, default: '18:00' },
  checkOutTime: { type: String, default: '11:00' },
  maxNights: { type: Number, default: 2 }
}, { timestamps: true });

export default mongoose.model<ISettings>('Settings', settingsSchema);
