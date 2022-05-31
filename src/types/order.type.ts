import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';

import { OrderStatus } from 'models/order.model';
import { ClientType } from 'types/client.type';
import { OrderDetailType } from './orderDetail.type';
import { TokenType } from './token.type';
import { UserType } from './user.type';

export const OrderStatusType = new GraphQLEnumType({
  name: 'OrderStatus',
  values: {
    PENDING: { value: OrderStatus.PENDING },
    DELIVERED: { value: OrderStatus.DELIVERED },
    CANCELED: { value: OrderStatus.CANCELED },
    RETURNED: { value: OrderStatus.RETURNED },
    CONFIRMED: { value: OrderStatus.CONFIRMED },
  },
});

export const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: { type: GraphQLID },
    reference: { type: GraphQLString },
    status: { type: OrderStatusType },
    subTotalPrice: { type: GraphQLString },
    totalPrice: { type: GraphQLString },
    deliveryCosts: { type: GraphQLString },
    valuePromoCode: { type: GraphQLString },
    paymentMethod: { type: GraphQLString },
    details: { type: new GraphQLList(OrderDetailType) },
    client: { type: ClientType },
    createdAt: { type: GraphQLDate },
    password: { type: GraphQLString },
  },
});

export const OrderTypeRegister = new GraphQLObjectType({
  name: 'OrderTypeRegister',
  fields: {
    order: { type: OrderType },
    token: { type: TokenType },
    user: { type: UserType },
    idClient: { type: ClientType },
  },
});

export const clientInfoType = new GraphQLInputObjectType({
  name: 'clientInfo',
  fields: {
    fullName: { type: GraphQLString },
    telephone: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },
    governorate: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    secondAddress: { type: GraphQLString },
  },
});
