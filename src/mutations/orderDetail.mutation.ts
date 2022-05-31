import create from 'crud/create';
import remove from 'crud/remove';
import update from 'crud/update';
import { GraphQLID, GraphQLInt, GraphQLString } from 'graphql';
import joi from 'joi';
import OrderDetail from 'models/orderDetail.model';
import { OrderDetailType } from 'types/orderDetail.type';

const createOrderDetailValidation = {
  idProduct: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  quantity: joi.number().required(),
  totalPrice: joi.string(),
};

const updateOrderDetailValidation = {
  idProduct: joi.string().regex(/^[0-9a-fA-F]{24}$/),
  quantity: joi.number(),
  totalPrice: joi.string(),
};

export default {
  createOrderDetail: create(
    OrderDetail,
    {
      idProduct: { type: GraphQLID, required: true },
      quantity: { type: GraphQLInt, required: true },
      totalPrice: { type: GraphQLString, required: false },
    },
    OrderDetailType,
    { validateSchema: createOrderDetailValidation, authorizationRoles: [] },
  ),
  updateOrderDetail: update(
    OrderDetail,
    { idProduct: GraphQLID, quantity: GraphQLInt, totalPrice: GraphQLString, idOrder: GraphQLID },
    OrderDetailType,
    { validateSchema: updateOrderDetailValidation, authorizationRoles: [] },
  ),
  removeOrderDetail: remove(OrderDetail, { authorizationRoles: [] }),
};
