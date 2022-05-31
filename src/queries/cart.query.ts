import apiWrapper from 'crud/apiWrapper';
import get from 'crud/get';
import list from 'crud/list';
import { GraphQLBoolean, GraphQLError, GraphQLList } from 'graphql';
import cartModel from 'models/cart.model';
import productModel from 'models/product.model';
import { Role } from 'models/user.model';

import { CartType } from 'types/cart.type';

import { OrderDetailInput } from 'types/orderDetail.type';

export default {
  carts: list(cartModel, CartType, {
    authorizationRoles: [Role.ADMIN, Role.OWNER, Role.CLIENT],
    pre: (args, req) => {
      const query: any = { ...args };
      const idUser = req?.user;
      if (idUser) query.idUser = idUser;
      return query;
    },
  }),
  cart: get(cartModel, CartType, { authorizationRoles: [Role.ADMIN, Role.OWNER, Role.CLIENT] }),

  verifyQuantityCart: apiWrapper(
    async (args) => {
      await Promise.all(
        args.details.map(async (_detail: any) => {
          const product = await productModel.findById(_detail.idProduct);
          if (!product) throw new GraphQLError('invalid id product');

          if (_detail.quantity > product.quantity) {
            throw new GraphQLError(
              `L'article de votre panier (${product.name}) n'est plus disponible dans cette quantité. Vous ne pouvez pas continuer votre commande avant d'avoir ajusté la quantité.`,
            );
          }
        }),
      );

      return true;
    },
    GraphQLBoolean,
    {
      details: { type: new GraphQLList(OrderDetailInput) },
    },
    {},
  ),
};
