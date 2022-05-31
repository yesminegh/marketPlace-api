import create from 'crud/create';
import remove from 'crud/remove';
import update from 'crud/update';
import { GraphQLError, GraphQLFloat, GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import joi from 'joi';
import Coupon, { uses } from 'models/coupon.model';
import { Role } from 'models/user.model';
import { CouponStatusType, CouponType } from 'types/coupon.type';

const createCouponValidation = {
  name: joi.string().required(),
  promoCode: joi.string().required(),
  useable: joi
    .string()
    .valid(...uses)
    .required(),

  value: joi.string().required(),
  dateStart: joi.date().required(),
  dateEnd: joi.date().required(),
};

const updateCouponValidation = {
  name: joi.string(),
  promoCode: joi.string(),
  useable: joi.string().valid(...uses),
  value: joi.string(),
  dateStart: joi.date(),
  dateEnd: joi.date(),
};

export default {
  createCoupon: create(
    Coupon,
    {
      name: { type: GraphQLString, required: true },
      promoCode: { type: GraphQLString, required: true },
      categoriesConcerned: { type: new GraphQLList(GraphQLID), required: true },
      useable: { type: CouponStatusType, required: true },
      minValue: { type: GraphQLFloat, required: false },
      maxValue: { type: GraphQLFloat, required: false },
      value: { type: GraphQLString, required: true },
      dateStart: { type: GraphQLString, required: true },
      dateEnd: { type: GraphQLString, required: true },
      idShop: { type: GraphQLID, required: false },
    },
    CouponType,
    {
      validateSchema: createCouponValidation,
      authorizationRoles: [Role.ADMIN, Role.OWNER],
      pre: async (agrs, req) => {
        const { ...query } = agrs;
        if (req.user?.idShop) query.idShop = req?.user.idShop;
        else if (req.user && req.user.role === 'owner') throw new GraphQLError('Veuillez cree une boutique');
        return query;
      },
    },
  ),
  updateCoupon: update(
    Coupon,
    {
      name: GraphQLString,
      promoCode: GraphQLString,
      categoriesConcerned: GraphQLList(GraphQLID),
      useable: CouponStatusType,
      minValue: GraphQLFloat,
      maxValue: GraphQLFloat,
      value: GraphQLString,
      dateStart: GraphQLString,
      dateEnd: GraphQLString,
    },
    CouponType,
    { validateSchema: updateCouponValidation, authorizationRoles: [] },
  ),
  removeCoupon: remove(Coupon, { authorizationRoles: [] }),
};
