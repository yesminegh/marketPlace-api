import mongoose, { Document, Model, Schema } from 'mongoose';

export interface category {
  name: string;
}

export interface categoryDocument extends category, Document {}

export type categoryModel = Model<categoryDocument>;

const categorySchema = new mongoose.Schema<categoryDocument, categoryModel>({
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

export default mongoose.model('Category', categorySchema);
