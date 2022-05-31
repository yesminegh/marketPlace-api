import joi from 'joi';
import { GraphQLString } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Category from 'models/category.model';

import { CategoryType } from 'types/category.type';

const createCategoryValidation = {
  name: joi.string().required(),
};

const updateCategoryValidation = {
  name: joi.string(),
};

export default {
  createCategory: create(Category, { name: { type: GraphQLString, required: true } }, CategoryType, {
    validateSchema: createCategoryValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  updateCategory: update(Category, { name: GraphQLString }, CategoryType, {
    validateSchema: updateCategoryValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeCategory: remove(Category, { authorizationRoles: [Role.ADMIN] }),
};
