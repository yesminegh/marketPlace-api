import joi from 'joi';
import { GraphQLString } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import Test from 'models/test.model';

import { TestType } from 'types/test.type';

const createTestValidation = {
  title: joi.string().required(),
};

const updateTestValidation = {
  title: joi.string(),
};

export default {
  createTest: create(Test, { title: { type: GraphQLString, required: true } }, TestType, {
    validateSchema: createTestValidation,
    authorizationRoles: [],
  }),
  updateTest: update(Test, { title: GraphQLString }, TestType, {
    validateSchema: updateTestValidation,
    authorizationRoles: [],
  }),
  removeTest: remove(Test, { authorizationRoles: [] }),
};
