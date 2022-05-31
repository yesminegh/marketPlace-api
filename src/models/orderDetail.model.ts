import mongoose, { Schema, Model, Document } from 'mongoose';

export interface OrderDetail {
  idProduct: Schema.Types.ObjectId;
  quantity: number;
  totalPrice: string;
}

export interface OrderDetailDocument extends Document, OrderDetail {}

export type OrderDetailModel = Model<OrderDetailDocument>;

const orderDetailSchema = new Schema<OrderDetailDocument, OrderDetailModel>(
  {
    idProduct: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    quantity: { type: Number, required: true },
    totalPrice: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('OrderDetail', orderDetailSchema);
