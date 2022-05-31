import get from 'crud/get';
import list from 'crud/list';
import { GraphQLError, GraphQLID, GraphQLNonNull } from 'graphql';
import Order from 'models/order.model';
import { OrderType } from 'types/order.type';

export default {
  orders: list(Order, OrderType, {
    authorizationRoles: [],
    pre: async (args, req) => {
      const { ...query } = args;
      if (req.user?.idShop) query.idShop = req?.user.idShop;
      else if (req.user && req.user.role === 'owner') throw new GraphQLError('Veuillez cree une boutique');
      return query;
    },
  }),
  order: get(Order, OrderType, { authorizationRoles: [] }),
  getOrder: list(Order, OrderType, {
    authorizationRoles: [],
    args: {
      client: { type: new GraphQLNonNull(GraphQLID) },
    },
  }),
};
