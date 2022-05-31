import mongoose, { Document, Model, Schema } from 'mongoose';
import { category } from './category.model';

export interface Shop {
  categories?: category[];
  name: string;
  slug?: string;
  description?: string;
  accroche?: string;
  logo?: string;
  coverImage?: string;
  owner?: Schema.Types.ObjectId;
}

export interface ShopDocument extends Document, Shop {}

export type ShopModel = Model<ShopDocument>;

const shopSchema = new mongoose.Schema<ShopDocument, ShopModel>(
  {
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
      },
    ],
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    accroche: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
shopSchema.pre('save', async function (next) {
  try {
    const string_to_slug = (str: string) => {
      str = str.replace(/^\s+|\s+$/g, ''); // trim
      str = str.toLowerCase();

      // remove accents, swap ñ for n, etc
      const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
      const to = 'aaaaaaeeeeiiiioooouuuunc------';

      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }

      str = str
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-+/, '') // trim - from start of text
        .replace(/-+$/, ''); // trim - from end of text

      return str;
    };

    const Shop = this.constructor;
    const slug = `/shop/${string_to_slug(this.name)}`;
    const slugShop = await (Shop as any).findOne({ slug: slug });
  
    if (!slugShop) {
      this.slug = `/shop/${string_to_slug(this.name)}`;
    } else this.slug = `/shop/${string_to_slug(this.name)}${Math.floor(Math.random() * 10)}`;
  } catch (e: any) {
    return next(e);
  }
});

export default mongoose.model('Shop', shopSchema);
