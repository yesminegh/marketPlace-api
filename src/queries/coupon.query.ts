import apiWrapper from 'crud/apiWrapper';
import get from 'crud/get';
import list from 'crud/list';
import { GraphQLError, GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import Coupon from 'models/coupon.model';
import couponClient from 'models/couponClient';
import { couponDetail, CouponType, VerifyCouponType } from 'types/coupon.type';

export default {
  coupons: list(Coupon, CouponType, {
    authorizationRoles: [],
    pre: async (args, req) => {
      const { ...query } = args;
      if (req.user?.idShop) query.idShop = req?.user.idShop;
      else if (req.user && req.user.role === 'owner') throw new GraphQLError('Veuillez cree une boutique');

      return query;
    },
  }),
  coupon: get(Coupon, CouponType, { authorizationRoles: [] }),
  verifyCoupon: apiWrapper(
    async ({ details, promoCode, idClient }) => {
      const result = await Coupon.findOne({
        dateStart: {
          $lte: new Date(),
        },
        dateEnd: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        categoriesConcerned: {
          $in: details.map((x: any) => {
            return x.categoriesConcerned;
          }),
        },
        promoCode: { $eq: promoCode },
      }).lean();
      if (!result) throw new GraphQLError('Le coupon est invalide');

      const priceValue = details.reduce(
        (sum: any, current: any) =>
          result.categoriesConcerned.map((e) => `${e}`).includes(current.categoriesConcerned.toString())
            ? sum + (current?.price || 0)
            : sum,
        0,
      );

      const coupon = await couponClient.findOne({ idCoupon: result._id, idClient });
      if (result.useable === 'once' && coupon?.used === 1) {
        throw new GraphQLError('Le coupon est déjà utilisé');
      }
      if (result.maxValue && priceValue > result.maxValue)
        throw new GraphQLError(`Le montant doit etre inférieur à ${result.maxValue}`);
      else if (result.minValue && priceValue < result.minValue)
        throw new GraphQLError(`Le montant doit etre supérieur  à ${result.minValue}`);
      return {
        ...result,
        priceToReduce: priceValue - priceValue * (1 - parseFloat(result.value) / 100),
      };
    },
    VerifyCouponType,
    {
      details: { type: GraphQLList(couponDetail) },
      promoCode: { type: GraphQLString },
      idClient: { type: GraphQLID },
    },
  ),
};
