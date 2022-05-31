import { GraphQLType, GraphQLNonNull } from 'graphql';
import { Model, Document } from 'mongoose';
import apiWrapper, { Options } from './apiWrapper';
import transformObject from 'utils/transformObject';
import { Profile } from 'passport';
import User, { UserDocument } from 'models/user.model';

function create<T extends Document, A extends { [key: string]: { type: GraphQLType; required: boolean } }, C>(
  model: Model<T>,
  args: A,
  type: GraphQLType,
  options: Options<T, A, C> = {},
) {
  return apiWrapper(
    async (args) => {
      let doc = await new model(args);
      doc = await doc.save();
      return doc;
    },
    type,
    transformObject(args, (value) => {
      if (value.required) return { type: new GraphQLNonNull(value.type) };
      return { type: value.type };
    }),
    options,
  );
}

export async function createUserFb(profile: Profile): Promise<UserDocument> {
  const args = {
    fullName: `${profile.name?.givenName} ${profile.name?.familyName}`,
    email: profile.emails && profile.emails[0] && profile.emails[0].value,
  };
  const doc = await new User(args);
  await doc.save();

  return doc;
}

export async function createUserGoogle(profile: Profile): Promise<UserDocument> {
  const args = {
    fullName: `${profile.name?.givenName} ${profile.name?.familyName}`,
    email: profile.emails && profile.emails[0] && profile.emails[0].value,
  };
  const doc = await new User(args);
  await doc.save();

  return doc;
}

export default create;
