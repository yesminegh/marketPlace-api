import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { CategoryType } from 'types/category.type';
import { SubCategoryType } from 'types/subCategory.type';
import { ShopType } from 'types/shop.type';
import { GraphQLUpload } from 'graphql-upload';
import { uploadInstance } from 'utils/upload';

export const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    priceAfterDiscount: { type: GraphQLString },
    idCategory: { type: CategoryType },
    idSubCategories: { type: new GraphQLList(SubCategoryType) },
    quantity: { type: GraphQLInt },
    discount: { type: GraphQLString },
    keywords: { type: GraphQLString },
    description: { type: GraphQLString },
    referenceCode: { type: GraphQLString },
    referenceClient: { type: GraphQLString },

    image: {
      type: new GraphQLList(GraphQLString),
      resolve: (parent) =>
        parent.image.length ? parent.image.map((e: string) => uploadInstance.convertKeyToS3Url(e)) : [''],
    },
    idShop: { type: ShopType },
  },
});
export const ImageType = new GraphQLInputObjectType({
  name: 'Image',
  fields: {
    first: { type: GraphQLBoolean },
    file: { type: GraphQLUpload },
  },
});
