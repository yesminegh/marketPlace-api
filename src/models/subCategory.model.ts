import mongoose, { Schema, Model, Document } from 'mongoose';

export interface SubCategory {
  name: string;
  idCategory: Schema.Types.ObjectId;
}

export interface SubCategoryDocument extends Document, SubCategory {}

export type SubCategoryModel = Model<SubCategoryDocument>;

const subCategorySchema = new Schema<SubCategoryDocument, SubCategoryModel>(
  {
    name: { type: String, trim: true, required: true },
    idCategory: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<SubCategoryDocument, SubCategoryModel>('SubCategory', subCategorySchema);
