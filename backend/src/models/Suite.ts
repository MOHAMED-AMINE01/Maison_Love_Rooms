import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockedDate {
  _id?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason: string;
  // Provenance : 'manuel' (blocage admin) ou 'airbnb' / 'booking' (import iCal).
  source?: 'manuel' | 'airbnb' | 'booking';
  // UID de l'évènement iCal importé, pour éviter les doublons lors des re-synchros.
  uid?: string;
}

export interface IIcalUrls {
  airbnb: string;
  booking: string;
}

export interface ISuite extends Document {
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  presentationTitle: string;
  atouts: string;
  callToAction: string;
  pricePerNight: number;
  features: string[];
  status: 'disponible' | 'maintenance';
  imageUrl: string;
  images: string[];
  blockedDates: IBlockedDate[];
  icalUrls: IIcalUrls;
}

const blockedDateSchema = new Schema<IBlockedDate>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  source: { type: String, enum: ['manuel', 'airbnb', 'booking'], default: 'manuel' },
  uid: { type: String }
});

const suiteSchema = new Schema<ISuite>(
  {
    name: { type: String, required: true, unique: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    presentationTitle: { type: String, default: '' },
    atouts: { type: String, default: '' },
    callToAction: { type: String, default: '' },
    pricePerNight: { type: Number, required: true },
    features: [{ type: String }],
    status: {
      type: String,
      enum: ['disponible', 'maintenance', 'en_maintenance'],
      default: 'disponible',
    },
    imageUrl: { type: String, default: '/images/suites/suite-1.jpg' },
    images: [{ type: String }],
    blockedDates: [blockedDateSchema],
    icalUrls: {
      airbnb: { type: String, default: '' },
      booking: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const Suite = mongoose.model<ISuite>('Suite', suiteSchema);

export default Suite;
