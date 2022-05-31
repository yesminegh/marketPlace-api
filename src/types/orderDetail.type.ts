import { GraphQLID, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLInputObjectType } from 'graphql';
import { OrderType } from 'types/order.type';
import { ProductType } from './product.type';

export const OrderDetailType = new GraphQLObjectType({
  name: 'OrderDetail',
  fields: {
    id: { type: GraphQLID },
    idProduct: { type: ProductType },
    quantity: { type: GraphQLInt },
    totalPrice: { type: GraphQLString },
  },
});
export const OrderDetailInput = new GraphQLInputObjectType({
  name: 'OrderDetailInput',
  fields: {
    id: { type: GraphQLID },
    idProduct: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    totalPrice: { type: GraphQLString },
  },
});
