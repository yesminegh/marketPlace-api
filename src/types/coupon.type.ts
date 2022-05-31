import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Useable } from 'models/coupon.model';
import { CategoryType } from './category.type';
import { ShopType } from './shop.type';

export const CouponStatusType = new GraphQLEnumType({
  name: 'CouponStatus',
  values: {
    multiple: { value: Useable.multiple },
    once: { value: Useable.once },
    none: { value: Useable.none },
  },
});

export const CouponType = new GraphQLObjectType({
  name: 'Coupon',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    promoCode: { type: GraphQLString },
    categoriesConcerned: { type: new GraphQLList(CategoryType) },

    useable: { type: CouponStatusType },
    minValue: { type: GraphQLFloat },
    maxValue: { type: GraphQLFloat },
    value: { type: GraphQLString },
    dateStart: { type: GraphQLString },
    priceToReduce: { type: GraphQLFloat },
    dateEnd: { type: GraphQLString },
    idShop: { type: ShopType },
    idClients: { type: GraphQLList(GraphQLID) },
  },
});
export const VerifyCouponType = new GraphQLObjectType({
  name: 'VerifyCouponType',
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    promoCode: { type: GraphQLString },
    categoriesConcerned: { type: new GraphQLList(GraphQLString) },
    useable: { type: CouponStatusType },
    minValue: { type: GraphQLFloat },
    maxValue: { type: GraphQLFloat },
    value: { type: GraphQLString },
    dateStart: { type: GraphQLString },
    priceToReduce: { type: GraphQLFloat },
    dateEnd: { type: GraphQLString },
    idShop: { type: ShopType },
    idClients: { type: GraphQLList(GraphQLID) },
  },
});
export const couponDetail = new GraphQLInputObjectType({
  name: 'couponDetail',
  fields: {
    categoriesConcerned: { type: GraphQLID },
    price: { type: GraphQLFloat },
  },
});
