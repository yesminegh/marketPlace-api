import mongoose, { Document, Model, Schema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  RETURNED = 'RETURNED',
}

export const OrdersStatus = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.DELIVERED,
  OrderStatus.RETURNED,
  OrderStatus.CANCELED,
];

export interface Order {
  reference: string;
  status: OrderStatus;
  subTotalPrice: string;
  totalPrice: string;
  deliveryCosts: string;
  valuePromoCode: string;
  paymentMethod: string;
  details: Schema.Types.ObjectId[];
  client: Schema.Types.ObjectId;
  idShop: Schema.Types.ObjectId;
}

export interface OrderDocument extends Document, Order {}

export type OrderModel = Model<OrderDocument>;

const OrderSchema = new Schema<OrderDocument, OrderModel>(
  {
    reference: { type: String },
    status: { type: String, enum: OrderStatus },
    subTotalPrice: { type: String },
    totalPrice: { type: String },
    deliveryCosts: { type: String, default: '7' },
    valuePromoCode: { type: String },
    paymentMethod: { type: String, default: 'Comptant' },
    details: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail' }],
    client: { type: Schema.Types.ObjectId, required: false, ref: 'Client' },
    idShop: { type: Schema.Types.ObjectId, required: false, ref: 'Shop' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Order', OrderSchema);
