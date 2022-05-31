import { GraphQLEnumType, GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql';
import { Gender, Role } from 'models/user.model';

export const UserRole = new GraphQLEnumType({
  name: 'Role',
  values: {
    [Role.ADMIN]: { value: Role.ADMIN },
    [Role.OWNER]: { value: Role.OWNER },
    [Role.CLIENT]: { value: Role.CLIENT },
  },
});
export const UserGender = new GraphQLEnumType({
  name: 'Gender',
  values: {
    FEMALE: { value: Gender.FEMALE },
    MALE: { value: Gender.MALE },
  },
});
export const UserType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    role: { type: UserRole },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    address: { type: GraphQLString },
    telephone: { type: GraphQLString },
    gender: { type: UserGender },
  },
});
