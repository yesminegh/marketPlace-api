import { GraphQLID, GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLInputObjectType } from 'graphql';
import { ProductType } from './product.type';
import { UserType } from './user.type';

export const CartItemType = new GraphQLObjectType({
  name: 'CartItem',
  fields: {
    idProduct: { type: ProductType },
    quantity: { type: GraphQLInt },
    id: { type: GraphQLID },
  },
});
export const CartItemTypeInput = new GraphQLInputObjectType({
  name: 'CartItemInput',
  fields: {
    idProduct: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    id: { type: GraphQLID },
  },
});
export const CartType = new GraphQLObjectType({
  name: 'CartType',
  fields: {
    id: { type: GraphQLID },
    cartItems: { type: new GraphQLList(CartItemType) },
    idUser: { type: UserType },
  },
});
