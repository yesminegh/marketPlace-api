import apiWrapper from 'crud/apiWrapper';
import remove from 'crud/remove';
import { GraphQLError, GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import joi from 'joi';
import { isEmpty } from 'lodash';
import Order, { OrdersStatus } from 'models/order.model';
import OrderService from 'services/order.service';
import { clientInfoType, OrderStatusType, OrderType, OrderTypeRegister } from 'types/order.type';
import { OrderDetailInput } from 'types/orderDetail.type';
import { generateTokenResponse } from 'utils/authHelpers';

const createOrderValidation = {
  reference: joi.string(),
  status: joi.string().valid(...OrdersStatus),
  details: joi.array().items().required(),
  totalPrice: joi.string(),
};

const updateOrderValidation = {
  reference: joi.string(),

  status: joi.string().valid(...OrdersStatus),
  details: joi.array().items(),
  totalPrice: joi.string(),
  idClient: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createOrder: apiWrapper(
    async (args, request) => {
      const details = await OrderService.createDetails(args.details);

      const { order, user, idClient } = await OrderService.createOrder(
        { ...args, details },
        args.password,
        args.clientInfo,
        args.idCoupons,
      );

      if (user) {
        const token = await generateTokenResponse(user, request);
        return { token, user, idClient: { id: idClient }, order };
      } else {
        return { order };
      }
    },
    OrderTypeRegister,
    {
      reference: { type: GraphQLString, required: false },
      status: { type: OrderStatusType, required: false },
      totalPrice: { type: GraphQLString, required: false },
      deliveryCosts: { type: GraphQLString, required: false },
      valuePromoCode: { type: GraphQLString, required: false },
      paymentMethod: { type: GraphQLString, required: false },
      clientInfo: { type: clientInfoType, required: false },
      details: { type: new GraphQLList(OrderDetailInput) },
      client: { type: GraphQLID, required: false },
      idShop: { type: GraphQLID, required: false },
      password: { type: GraphQLString, required: false },
      idCoupons: { type: GraphQLID, required: false },
    },
    { validateSchema: createOrderValidation, authorizationRoles: [] },
  ),

  updateOrder: apiWrapper(
    async (args) => {
      const { id, ...status } = args;
      if (isEmpty(status)) throw new GraphQLError('Vous devez renseigner au moins un élément pour valider');

      const doc = await Order.findOneAndUpdate({ _id: id }, status as any, { new: true });
      if (!doc) throw new GraphQLError('Le document est introuvable');
      return doc;
    },
    OrderType,
    {
      id: { type: GraphQLID },
      status: { type: OrderStatusType },
    },

    { validateSchema: updateOrderValidation, authorizationRoles: [] },
  ),
  removeOrder: remove(Order, { authorizationRoles: [] }),
};
