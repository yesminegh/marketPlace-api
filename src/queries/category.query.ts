import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Category from 'models/category.model';

import { CategoryType } from 'types/category.type';

export default {
  categorys: list(Category, CategoryType, { authorizationRoles: [] }),
  category: get(Category, CategoryType, { authorizationRoles: [Role.ADMIN] }),
};
