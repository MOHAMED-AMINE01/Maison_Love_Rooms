import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  suiteName: string;
  checkIn: Date;
  checkOut: Date;
  numberOfPersons: number;
  services: string[];
  specialRequest?: string;
  internalNote?: string;
  totalPrice: number;
  status: 'en_attente' | 'confirmee' | 'validee' | 'annulee' | 'terminee';
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String },
    suiteName: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numberOfPersons: { type: Number, default: 2 },
    services: [{ type: String }],
    specialRequest: { type: String },
    internalNote: { type: String },
    totalPrice: { type: Number, required: true },
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
