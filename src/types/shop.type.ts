import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';
import { CategoryType } from 'types/category.type';
import { UserType } from 'types/user.type';
import { uploadFileS3, uploadInstance } from 'utils/upload';

export const ShopType = new GraphQLObjectType({
  name: 'Shop',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    categories: { type: new GraphQLList(CategoryType) },
    description: { type: GraphQLString },
    slug: { type: GraphQLString },
    accroche: { type: GraphQLString },
    coverImage: {
      type: GraphQLString,
      resolve: (parent) => (parent.coverImage ? uploadInstance.convertKeyToS3Url(parent.coverImage) : ''),
    },
    owner: { type: UserType },
    logo: {
      type: GraphQLString,
      resolve: (parent) => (parent.logo ? uploadInstance.convertKeyToS3Url(parent.logo) : ''),
    },
  },
});
