import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import SubCategory from 'models/subCategory.model';

import { SubCategoryType } from 'types/subCategory.type';
import { GraphQLID, GraphQLList } from 'graphql';

interface MedicineSearchArguments {
  idCategory: string[];
}

function getMedicinesSearchArguments({ idCategory, ...rest }: MedicineSearchArguments) {
  const query: any = { ...rest };

  if (idCategory) query.idCategory = idCategory;

  return query;
}

export default {
  subCategorys: list(SubCategory, SubCategoryType, {
    authorizationRoles: [],
    args: {
      idCategory: { type: GraphQLList(GraphQLID) },
    },
    pre: getMedicinesSearchArguments as any,
  }),
  subCategory: get(SubCategory, SubCategoryType, { authorizationRoles: [Role.ADMIN] }),
};
