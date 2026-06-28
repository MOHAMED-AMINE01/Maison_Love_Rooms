import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  suiteName: string;
  checkIn: Date;
  checkOut: Date;
  arrivalTime?: string;
  numberOfPersons: number;
  services: string[];
  occasion?: string;
  specialRequest?: string;
  internalNote?: string;
  totalPrice: number;
  consentGiven?: boolean;
  status: 'en_attente' | 'confirmee' | 'validee' | 'annulee' | 'terminee';
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String },
    clientAddress: { type: String },
    suiteName: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    arrivalTime: { type: String },
    numberOfPersons: { type: Number, default: 2 },
    services: [{ type: String }],
    occasion: { type: String },
    specialRequest: { type: String },
    internalNote: { type: String },
    totalPrice: { type: Number, required: true },
    consentGiven: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['en_attente', 'confirmee', 'validee', 'annulee', 'terminee'],
      default: 'en_attente',
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);

export default Reservation;
