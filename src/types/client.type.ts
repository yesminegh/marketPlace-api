import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql';
import orderModel from 'models/order.model';

import { UserType } from 'types/user.type';

export const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    fullName: { type: GraphQLString },
    address: { type: GraphQLString },
    telephone: { type: GraphQLString },
    totalAmountPaid: { type: GraphQLString },
    user: { type: UserType },
    countOrder: {
      type: GraphQLString,
      resolve: (parent) => {
        const count = orderModel.countDocuments({ client: parent.id });
        return count;
      },
    },
  },
});
