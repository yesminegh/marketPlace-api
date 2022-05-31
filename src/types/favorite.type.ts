import { GraphQLID, GraphQLObjectType, GraphQLList } from 'graphql';
import { ProductType } from './product.type';
import { UserType } from './user.type';

export const FavoriteType = new GraphQLObjectType({
  name: 'FavoriteType',
  fields: {
    id: { type: GraphQLID },
    idProducts: { type: new GraphQLList(ProductType) },
    idUser: { type: UserType },
  },
});
