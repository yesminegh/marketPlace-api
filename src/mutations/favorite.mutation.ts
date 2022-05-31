import apiWrapper from 'crud/apiWrapper';
import { GraphQLBoolean, GraphQLError, GraphQLID } from 'graphql';
import favoriteModel from 'models/favoriteModel';

// const createOrderDetailValidation = {
//   idProduct: joi
//     .string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   quantity: joi.number().required(),
//   totalPrice: joi.string(),
// };

// const updateOrderDetailValidation = {
//   idProduct: joi.string().regex(/^[0-9a-fA-F]{24}$/),
//   quantity: joi.number(),
//   totalPrice: joi.string(),
// };

export default {
  addFavorite: apiWrapper(
    async (args, req) => {
      const { idProduit } = args;
      if (!req.user) throw new GraphQLError('Acces Refusé');
      if (!idProduit) throw new GraphQLError('Pas de produit');
      await favoriteModel.updateOne(
        { idUser: req.user },
        {
          $push: { idProducts: idProduit },
        },
      );
      return true;
    },
    GraphQLBoolean,
    { idProduit: { type: GraphQLID } },
    {
      authorizationRoles: [],
    },
  ),
  removeFav: apiWrapper(
    async (args, req) => {
      const { idProduit } = args;
      if (!req.user) throw new GraphQLError('Acces Refusé');
      if (!idProduit) throw new GraphQLError('Pas de produit');
      await favoriteModel.updateOne(
        { idUser: req.user },
        {
          $pull: { idProducts: idProduit },
        },
      );
      return true;
    },
    GraphQLBoolean,
    { idProduit: { type: GraphQLID } },
    {
      authorizationRoles: [],
    },
  ),
};
