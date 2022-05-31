import mongoose, { Schema, Model, Document } from 'mongoose';

export interface favoriteModel {
  idProduct: Schema.Types.ObjectId;
  quantity: number;
  totalPrice: string;
}

export interface favoriteModelDocument extends Document, favoriteModel {}

export type favoriteModelModel = Model<favoriteModelDocument>;

const favoriteModelSchema = new Schema<favoriteModelDocument, favoriteModelModel>(
  {
    idProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Favorite', favoriteModelSchema);
