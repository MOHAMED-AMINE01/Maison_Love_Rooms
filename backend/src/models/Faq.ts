import mongoose, { Document, Schema } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  order: number;
  status: 'actif' | 'inactif';
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['actif', 'inactif'],
      default: 'actif',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFaq>('Faq', faqSchema);
