import mongoose, { Document, Model, Schema } from 'mongoose';
import { category } from './category.model';
import { SubCategory } from './subCategory.model';
import { Shop } from './shop.model';
export interface image {
  first: boolean;
  file: string;
}

export interface Product {
  name?: string;
  price: string;
  priceAfterDiscount: string;
  idCategory?: category;
  idSubCategories?: SubCategory[];
  quantity: number;
  discount?: string;
  keywords?: string;
  description?: string;
  referenceCode: string;
  referenceClient: string;
  image: string[];
  idShop: Shop;
}

export interface productDocument extends Document, Product {}

export type productModel = Model<productDocument>;

const productSchema = new mongoose.Schema<productDocument, productModel>(
  {
    name: {
      type: String,
      trim: true,
      required: false,
    },
    price: {
      type: String,
      trim: true,
      required: true,
    },
    priceAfterDiscount: {
      type: String,
      trim: true,
      required: true,
    },
    idCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    idSubCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
      },
    ],
    quantity: {
      type: Number,
      trim: true,
      required: true,
    },
    discount: {
      type: String,
      trim: true,
      required: false,
    },
    keywords: {
      type: String,
      trim: true,
      required: false,
    },
    description: {
      type: String,
      trim: true,
      required: false,
    },
    referenceCode: {
      type: String,
      trim: true,
      required: true,
    },
    referenceClient: {
      type: String,
      trim: true,
      required: false,
    },
    image: {
      type: [{ type: String, required: true }],
      required: false,
    },
    idShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('Product', productSchema);
