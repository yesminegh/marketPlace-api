import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Test from 'models/test.model';

import { TestType } from 'types/test.type';

export default {
  tests: list(Test, TestType, { authorizationRoles: [] }),
  test: get(Test, TestType, { authorizationRoles: [] }),
};
