import mongoose, { Document, Model, Schema } from 'mongoose';
import { category } from './category.model';
import { Shop } from './shop.model';
export enum Useable {
  multiple = 'multiple',
  once = 'once',
  none = 'none',
}
export const uses = [Useable.multiple, Useable.none, Useable.once];

export interface Coupon {
  name: string;
  promoCode: string;
  categoriesConcerned: category[];
  useable: Useable;
  minValue: number;
  maxValue: number;
  value: string;
  dateStart: Date;
  dateEnd: Date;
  idShop: Shop;
}
export interface CouponDocument extends Document, Coupon {}
export type CouponModel = Model<CouponDocument>;
const CouponSchema = new mongoose.Schema<CouponDocument, CouponModel>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    promoCode: {
      type: String,
      trim: true,
      required: true,
    },
    categoriesConcerned: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    useable: {
      type: String,
      enum: uses,
      required: true,
    },
    minValue: {
      type: Number,
      trim: true,
      required: false,
    },
    maxValue: {
      type: Number,
      trim: true,
      required: false,
    },
    value: {
      type: String,
      trim: true,
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    idShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Coupon', CouponSchema);
