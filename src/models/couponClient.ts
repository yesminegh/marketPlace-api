import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CouponClient {
  idClient: Schema.Types.ObjectId;
  idCoupon: Schema.Types.ObjectId;
  used: number;
}
export interface CouponClientDocument extends Document, CouponClient {}
export type CouponClientModel = Model<CouponClientDocument>;
const CouponClientSchema = new mongoose.Schema<CouponClientDocument, CouponClientModel>(
  {
    idCoupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      required: false,
    },
    idClient: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: false,
    },
    used: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('CouponClient', CouponClientSchema);
