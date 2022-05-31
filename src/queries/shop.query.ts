import list from 'crud/list';
import get from 'crud/get';

import Shop from 'models/shop.model';

import { ShopType } from 'types/shop.type';
import { GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';
function getShopsbyArgs({ owner, ...rest }: { owner: string }) {
  const query: any = { ...rest };
  if (owner) {
    query.owner = owner;
  }
  return query;
}

export default {
  shops: list(Shop, ShopType, {
    authorizationRoles: [],
    args: {
      owner: { type: GraphQLID },
    },
    pre: getShopsbyArgs as any,
  }),
  shop: get(Shop, ShopType, { authorizationRoles: [] }),
  getShop: list(Shop, ShopType, {
    authorizationRoles: [],
    args: {
      slug: { type: new GraphQLNonNull(GraphQLString) },
    },
  }),
};
