import axios from 'axios';
/* eslint-disable @typescript-eslint/no-var-requires */
import bcrypt from 'bcryptjs';
import { shopUrl, SMS_API_KEY } from 'config/vars';
import apiWrapper from 'crud/apiWrapper';
import create from 'crud/create';
import update from 'crud/update';
import { GraphQLBoolean, GraphQLError, GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import joi from 'joi';
import jwt from 'jsonwebtoken';
import { random } from 'lodash';
import cartModel from 'models/cart.model';
import clientSchema from 'models/client.model';
import favoriteModel from 'models/favoriteModel';
import RefreshToken from 'models/refreshToken.model';
import resetPassword from 'models/resetPassword';
import shopModel from 'models/shop.model';
import User, { Role } from 'models/user.model';
import { AuthType } from 'types/auth.type';
import { HashCodeTel } from 'types/token.type';
import { UserGender, UserRole, UserType } from 'types/user.type';
import { generateTokenResponse, getAgent } from 'utils/authHelpers';
import { sendEmailReset } from 'utils/sendEmail';
import { accessSecret, clientUrl } from './../config/vars';

const refreshSchema = {
  refreshToken: joi.string().required(),
};

const loginSchema = {
  email: joi.string().email({ minDomainSegments: 2 }).required(),
  password: joi.string().required().min(6).max(128),
};

const registerSchema = {
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
  fullName: joi.string().min(1).max(30).required(),
};
const veriftelSchema = {
  telephone: joi.string().min(8).max(20).required(),
  verifCode: joi.boolean().required(),
};

const resetSchema = {
  token: joi.string(),
  email: joi.string().email(),
};

const verifSchema = {
  token: joi.string().required(),
};

const valid: { [key: string]: string } = {
  client: shopUrl || '',
  admin: shopUrl || '',
  owner: clientUrl || '',
};

export default {
  login: apiWrapper(
    async (args, req) => {
      const user = await User.findOne({ email: args.email });
      if (!user || !(await user.passwordMatches(args.password)))
        throw new GraphQLError('Email et mot de passe ne correspondent pas');
      // if (valid[user.role as any] !== req.headers.origins)
      //   throw new GraphQLError('Email et mot de passe ne correspondent pas');
      const idShop = user.role === 'owner' ? await shopModel.findOne({ owner: user.id }) : '';
      const idClient = user.role === 'client' ? await clientSchema.findOne({ user: user.id }) : '';

      const token = await generateTokenResponse(user, req);
      return !idShop ? { token, user, idClient } : { token, user, idShop, idClient };
    },
    AuthType,
    {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    { validateSchema: loginSchema },
  ),
  register: create(
    User,
    {
      email: { type: GraphQLString, required: true },
      password: { type: GraphQLString, required: true },
      fullName: { type: GraphQLString, required: true },
      address: { type: GraphQLString, required: false },
      telephone: { type: GraphQLString, required: false },
      role: { type: UserRole, required: false },
      gender: { type: UserGender, required: false },
    },
    AuthType,
    {
      validateSchema: registerSchema,
      pre: async (args) => {
        const { email, ...rest } = args;
        if (email) {
          const existEmail = await User.findOne({ email });
          if (existEmail) throw new GraphQLError("L'adresse e-mail existe déjà");
        }
        return { ...rest, email };
      },
      post: async ({ result: user, request }) => {
        const idClient = user.role === 'client' ? await clientSchema.create({ user: user.id }) : '';
        const token = await generateTokenResponse(user, request);
        const idShop = user.role === 'owner' ? await shopModel.findOne({ owner: user.id }) : '';
        if (user?.role === 'client') {
          const NewFavoriteList = new favoriteModel({ idUser: user.id });
          await NewFavoriteList.save();
          const NewCart = new cartModel({ idUser: user.id });
          await NewCart.save();
        }
        return { token, user, idShop, idClient };
      },
    },
  ),
  updateUser: update(
    User,
    {
      id: GraphQLID,
      email: GraphQLString,
      fullName: GraphQLString,
      address: GraphQLString,
      telephone: GraphQLString,
      password: GraphQLString,
    },
    UserType,
    {
      validateSchema: {},
      authorizationRoles: [],
      pre: async ({ password, ...args }) => {
        const query: any = { ...args };
        if (password) query.password = await bcrypt.hash(password, 10);
        return query;
      },
    },
  ),
  updatePassword: update(
    User,
    {
      id: GraphQLID,
      email: GraphQLString,
      actualPassword: GraphQLString,
      password: GraphQLString,
    },
    UserType,
    {
      validateSchema: {},
      authorizationRoles: [],
      pre: async ({ password, actualPassword, email, ...args }) => {
        const query: any = { ...args };
        const user = await User.findById(args.id);
        if (email) {
          const existEmail = await User.findOne({ email });
          if (existEmail && existEmail.email !== user?.email) throw new GraphQLError("L'adresse e-mail existe déjà");
          query.email = email;
        }
        if (actualPassword && password) {
          if (!user || !(await user.passwordMatches(actualPassword))) throw new GraphQLError(' mot de passe invalide');
          query.password = await bcrypt.hash(password, 10);
        }
        return query;
      },
    },
  ),
  refresh: apiWrapper(
    async (args, req) => {
      const refreshToken = await RefreshToken.findOne({
        token: args.refreshToken,
      });
      if (!refreshToken) throw new GraphQLError('Invalid token');
      const user = await User.findOne({ _id: refreshToken.user });
      if (!user) throw new GraphQLError('Invalid token');
      const idShop = user.role === 'owner' ? await shopModel.findOne({ owner: user.id }) : '';
      const idClient = user.role === 'client' ? await clientSchema.findOne({ user: user.id }) : '';
      const token = await generateTokenResponse(user, req);

      return !idShop ? { token, user, idClient } : { token, user, idShop, idClient };
    },
    AuthType,
    {
      refreshToken: { type: new GraphQLNonNull(GraphQLString) },
    },
    {
      validateSchema: refreshSchema,
    },
  ),
  logout: apiWrapper(
    async (args, req) => {
      const { user } = req;
      const agent = getAgent(req);
      if (user) {
        await RefreshToken.deleteOne({ userId: user.id, agent });
      }
      return 'done';
    },
    GraphQLString,
    {},
    { authorizationRoles: [Role.OWNER, Role.ADMIN, Role.CLIENT] },
  ),
  sendSMS: apiWrapper(
    async (args) => {
      const telephone: string = args.telephone?.split(' ').join('');
      const number = String(random(1000, 9000, false));
      const hashedNumber = bcrypt.hashSync(number, 10);
      const smsContent = encodeURIComponent(`Votre code de verification ${number}`);
      axios
        .get(
          // eslint-disable-next-line max-len
          `https://www.winsmspro.com/sms/sms/api?action=send-sms&api_key=${SMS_API_KEY}&to=216${telephone}&from=Packshop&sms=${smsContent}`,
        )
        .then(({ data }) => {
          if (data.code !== 'ok') throw new GraphQLError('Erreur SMS');
          else return data;
        })
        .catch((error: Error) => {
          return false && console.log(error);
        });
      console.log(number);
      return { hashCode: hashedNumber };
    },
    HashCodeTel,
    {
      telephone: { type: GraphQLString, required: true },
    },
    { authorizationRoles: [] },
  ),
  verifyTel: apiWrapper(
    async (args, req) => {
      const { telephone, verifCode } = args;
      if (!verifCode) throw new GraphQLError('numéro telephone non verifié');
      const { user } = req;

      const userDoc = await User.findById(user?._id);
      if (!userDoc) throw new GraphQLError('invalid user id');
      userDoc.telephone = telephone;
      userDoc.active = true;
      await userDoc.save();
      return userDoc;
    },
    UserType,
    {
      telephone: { type: GraphQLString, required: true },
      verifCode: { type: GraphQLBoolean, required: true },
    },
    {
      validateSchema: veriftelSchema,
      authorizationRoles: [],
    },
  ),
  resetPassword: apiWrapper(
    async (args) => {
      const { email, token: tokenPassed } = args;
      if (tokenPassed) {
        jwt.verify(tokenPassed, accessSecret, async (error: any, { idUser, email }: any) => {
          if (error || !email) {
            throw new GraphQLError('Session Expirées');
          }
          const token = jwt.sign({ idUser, email }, accessSecret);
          const resetToken = new resetPassword({ idUser });
          const link = `${clientUrl}/RenewPassword?t=${token}`;
          await resetToken.save();
          sendEmailReset({ email, link });
        });
      } else {
        const user = await User.findOne({ email });

        if (!user) throw new GraphQLError('Aucun utilisateur avec cet email');
        const token = jwt.sign({ idUser: user?._id, email }, accessSecret);
        const resetToken = new resetPassword({ idUser: user?._id });
        const link = `${clientUrl}/RenewPassword?t=${token}`;

        sendEmailReset({ email, link });
        await resetToken.save();
        return user;
      }
    },
    UserType,
    {
      email: { type: GraphQLString, required: false },
      token: { type: GraphQLString, required: false },
    },
    {
      validateSchema: resetSchema,
      authorizationRoles: [],
    },
  ),
  verifToken: apiWrapper(
    async (args) => {
      const { token } = args;
      return jwt.verify(token, accessSecret, async (error: any, { idUser }: any) => {
        if (error || !idUser) {
          throw new GraphQLError('Session Expirées');
        }
        const tokenData: any = await resetPassword.findOne({ idUser }).populate('idUser');
        if (!tokenData) throw new GraphQLError('Session Expirées');
        return tokenData?.idUser;
      });
    },
    UserType,
    {
      token: { type: GraphQLString, required: true },
    },
    {
      validateSchema: verifSchema,
      authorizationRoles: [],
    },
  ),
  me: apiWrapper(
    async (args) => {
      const user = await User.findOne({ email: args.email });
      return user;
    },
    UserType,
    {
      email: { type: GraphQLString, required: true },
    },
    {
      validateSchema: {},
      authorizationRoles: [],
    },
  ),
};
