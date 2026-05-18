import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockedDate {
  _id?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface ISuite extends Document {
  name: string;
  description: string;
  pricePerNight: number;
  features: string[];
  status: 'disponible' | 'en_maintenance';
  imageUrl: string;
  images: string[];
  blockedDates: IBlockedDate[];
}

const blockedDateSchema = new Schema<IBlockedDate>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true }
});

const suiteSchema = new Schema<ISuite>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    features: [{ type: String }],
    status: {
      type: String,
      enum: ['disponible', 'en_maintenance'],
      default: 'disponible',
    },
    imageUrl: { type: String, default: '/images/suites/suite-1.jpg' },
    images: [{ type: String }],
    blockedDates: [blockedDateSchema],
  },
  {
    timestamps: true,
  }
);

const Suite = mongoose.model<ISuite>('Suite', suiteSchema);

export default Suite;
