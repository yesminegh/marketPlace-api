import get from 'crud/get';
import list from 'crud/list';
import favoriteModel from 'models/favoriteModel';
import { Role } from 'models/user.model';
import { FavoriteType } from 'types/favorite.type';

export default {
  favorites: list(favoriteModel, FavoriteType, {
    authorizationRoles: [Role.ADMIN, Role.OWNER, Role.CLIENT],
    pre: (args, req) => {
      const query: any = { ...args };
      const idUser = req?.user;
      if (idUser) query.idUser = idUser;
      return query;
    },
  }),
  favorite: get(favoriteModel, FavoriteType, { authorizationRoles: [Role.ADMIN, Role.OWNER, Role.CLIENT] }),
};
