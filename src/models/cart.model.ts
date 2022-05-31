import mongoose, { Schema, Model, Document } from 'mongoose';

export interface CartModel {
  idProduct: Schema.Types.ObjectId;
  quantity: number;
  totalPrice: string;
}

export interface CartModelDocument extends Document, CartModel {}

export type CartModelModel = Model<CartModelDocument>;

const CartModelSchema = new Schema<CartModelDocument, CartModelModel>(
  {
    idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: [
      {
        idProduct: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Schema.Types.Number },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Cart', CartModelSchema);
