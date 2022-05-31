import { GraphQLObjectType, GraphQLString } from 'graphql';
import { ClientType } from './client.type';
import { ShopType } from './shop.type';
import { TokenType } from './token.type';
import { UserType } from './user.type';

export const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: {
    user: { type: UserType },
    idShop: { type: ShopType || GraphQLString },
    token: { type: TokenType },
    idClient: { type: ClientType || GraphQLString },
  },
});
