import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql';
import { CategoryType } from './category.type';

export const SubCategoryType = new GraphQLObjectType({
  name: 'SubCategory',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    idCategory: { type: CategoryType },
  },
});
