import joi from 'joi';
import { GraphQLString, GraphQLID } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import SubCategory from 'models/subCategory.model';

import { SubCategoryType } from 'types/subCategory.type';

const createSubCategoryValidation = {
  name: joi.string().required(),
  idCategory: joi
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
};

const updateSubCategoryValidation = {
  name: joi.string(),
  idCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/),
};

export default {
  createSubCategory: create(
    SubCategory,
    { name: { type: GraphQLString, required: true }, idCategory: { type: GraphQLID, required: true } },
    SubCategoryType,
    { validateSchema: createSubCategoryValidation, authorizationRoles: [Role.ADMIN] },
  ),
  updateSubCategory: update(SubCategory, { name: GraphQLString, idCategory: GraphQLID }, SubCategoryType, {
    validateSchema: updateSubCategoryValidation,
    authorizationRoles: [Role.ADMIN],
  }),
  removeSubCategory: remove(SubCategory, { authorizationRoles: [Role.ADMIN] }),
};
