import apiWrapper from 'crud/apiWrapper';
import { GraphQLBoolean, GraphQLError, GraphQLID, GraphQLInt, GraphQLList } from 'graphql';
import cartModel from 'models/cart.model';
import { CartItemTypeInput } from 'types/cart.type';

export default {
  addCartItem: apiWrapper(
    async (args, req) => {
      const { idProduct, quantity } = args;
      if (!req.user) throw new GraphQLError('Acces Refusé');
      if (!idProduct) throw new GraphQLError('Pas de produit');
      const hasDoc = await cartModel.countDocuments({ idUser: req.user, 'cartItems.idProduct': idProduct });
      if (hasDoc > 0) {
        await cartModel.updateOne(
          { idUser: req.user, 'cartItems.idProduct': idProduct },
          {
            $set: { 'cartItems.$.quantity': quantity },
          },
        );
      } else {
        await cartModel.updateOne(
          { idUser: req.user },
          {
            idUser: req.user,
            $push: { cartItems: { idProduct, quantity } },
          },
          { upsert: true },
        );
      }

      return true;
    },
    GraphQLBoolean,
    { idProduct: { type: GraphQLID }, quantity: { type: GraphQLInt } },
    {
      authorizationRoles: [],
    },
  ),
  updateCart: apiWrapper(
    async (args, req) => {
      const { cartItems } = args;
      if (!req.user) throw new GraphQLError('Acces Refusé');
      if (!Array.isArray(cartItems)) throw new GraphQLError('Pas de produit');
      await cartModel.updateOne(
        { idUser: req.user },
        {
          cartItems,
        },
      );
      return true;
    },
    GraphQLBoolean,
    { cartItems: { type: new GraphQLList(CartItemTypeInput) } },
    {
      authorizationRoles: [],
    },
  ),
  removeCartItem: apiWrapper(
    async (args, req) => {
      const { idProduit } = args;
      if (!req.user) throw new GraphQLError('Acces Refusé');
      if (!idProduit) throw new GraphQLError('Pas de produit');

      await cartModel.updateOne(
        { idUser: req.user },
        {
          $pull: { cartItems: { idProduct: idProduit } },
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
