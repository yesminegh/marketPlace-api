import get from 'crud/get';
import list from 'crud/list';
import { GraphQLError } from 'graphql';
import clientSchema from 'models/client.model';

import { Role } from 'models/user.model';
import { ClientType } from 'types/client.type';

export default {
  clients: list(clientSchema, ClientType, {
    authorizationRoles: [Role.ADMIN, Role.OWNER],
    pre: async (args, req) => {
      const { ...query } = args;
      if (req.user?.idShop) query.idsShops = { $in: req?.user.idShop };
      else if (req.user && req.user.role === 'owner') throw new GraphQLError('Veuillez cree une boutique');
      return query;
    },
  }),
  client: get(clientSchema, ClientType, { authorizationRoles: [Role.ADMIN, Role.OWNER] }),
};
