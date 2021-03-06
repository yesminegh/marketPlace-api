import { GraphQLObjectType, GraphQLString } from 'graphql';

export const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: {
    tokenType: { type: GraphQLString },
    accessToken: {
      type: GraphQLString,
    },
    refreshToken: { type: GraphQLString },
    expiresIn: { type: GraphQLString },
  },
});

export const HashCodeTel = new GraphQLObjectType({
  name: 'HashCode',
  fields: {
    hashCode: { type: GraphQLString },
  },
});
