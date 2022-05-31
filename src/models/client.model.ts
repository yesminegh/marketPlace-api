import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Client {
  email: string;
  password: string;
  fullName: string;
  address: string;
  governorate: string;
  postalCode: string;
  secondAddress: string;
  telephone: string;
  totalAmountPaid: string;
  idsShops: Schema.Types.ObjectId[];
  user: Schema.Types.ObjectId;
}

export interface ClientDocument extends Document, Client {}
export type ClientModel = Model<ClientDocument>;

const clientSchema = new mongoose.Schema<ClientDocument, ClientModel>({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    trim: true,
    lowercase: true,
    required: false,
  },
  fullName: {
    type: String,
    trim: true,
    max: 30,
    required: false,
  },
  address: {
    type: String,
    trim: true,
    required: false,
  },
  governorate: {
    type: String,
    trim: true,
    required: false,
  },
  postalCode: {
    type: String,
    trim: true,
    required: false,
  },
  secondAddress: {
    type: String,
    trim: true,
    required: false,
  },
  telephone: {
    type: String,
    trim: true,
    required: false,
  },
  totalAmountPaid: {
    type: String,
    trim: true,
    required: false,
  },
  idsShops: [{ type: Schema.Types.ObjectId, ref: 'Shop', required: false }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
});

export default mongoose.model('Client', clientSchema);
