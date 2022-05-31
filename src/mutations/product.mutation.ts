// import joi from 'joi';
import { GraphQLString, GraphQLID, GraphQLList, GraphQLError, GraphQLInt } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import { Role } from 'models/user.model';
import Product from 'models/product.model';
import Shop from 'models/shop.model';

import { ProductType } from 'types/product.type';
import { GraphQLUpload } from 'graphql-upload';

import apiWrapper from 'crud/apiWrapper';

import categoryModel from 'models/category.model';
import { uploadFileS3, uploadInstance } from 'utils/upload';
import productService from 'services/product.service';
import productModel from 'models/product.model';

import { s3Url } from 'config/vars';

// const createProductValidation = {
//   name: joi.string().min(1).max(50).required(),
//   price: joi.string().max(10).required(),
//   idCategory: joi
//     .string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   idSubCategories: joi
//     .array()
//     .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
//     .required(),
//   quantity: joi.number().required(),
//   discount: joi.string().required(),
//   keywords: joi.string().required(),
//   description: joi.string().required(),
//   referenceClient: joi.string().required(),
//   image: joi.array().items(),
//   idShop: joi
//     .string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
// };

// const updateProductValidation = {
//   name: joi.string().min(1).max(50),
//   price: joi.string().max(10),
//   idCategory: joi.string().regex(/^[0-9a-fA-F]{24}$/),
//   idSubCategories: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
//   quantity: joi.number(),
//   discount: joi.string(),
//   keywords: joi.string(),
//   description: joi.string(),
//   referenceClient: joi.string(),
//   image: {},
//   idShop: joi.string().regex(/^[0-9a-fA-F]{24}$/),
// };

export default {
  createProduct: create(
    Product,
    {
      name: { type: GraphQLString, required: false },
      price: { type: GraphQLString, required: true },
      idCategory: { type: GraphQLID, required: false },
      idSubCategories: { type: new GraphQLList(GraphQLID), required: false },
      quantity: { type: GraphQLInt, required: true },
      discount: { type: GraphQLString, required: false },
      keywords: { type: GraphQLString, required: false },
      description: { type: GraphQLString, required: false },
      referenceClient: { type: GraphQLString, required: false },
      image: { type: new GraphQLList(GraphQLUpload), required: false },
    },
    ProductType,
    {
      validateSchema: {},
      authorizationRoles: [],
      pre: async (args, req) => {
        const { image, ...rest } = args;
        const shop = await Shop.findOne({ owner: req.user?._id });
        if (!shop) throw new GraphQLError('Cet utilisateur ne possede pas de boutique ');
        const idCategory = await categoryModel.findById(rest.idCategory);
        const id = `${shop?.owner}`;
        const productDest = `public/${shop?.name}_${id.slice(-5)}/`;
        if (image?.length) {
          return await Promise.all(
            image?.map(async (file) => {
              if (file) return await uploadFileS3(productDest, file);
            }),
          ).then(
            async (res) =>
              await productService.createProductArgs({ ...rest, idShop: shop, idCategory, image: res } as any),
          );
        }
        return await productService.createProductArgs({ ...rest, idShop: shop, idCategory } as any);
      },

      post: ({
        result: {
          image,
          _id,
          name,
          idCategory,
          idSubCategories,
          idShop,
          price,
          quantity,
          referenceClient,
          description,
          keywords,
        },
      }) => {
        return {
          id: _id,
          image: image,
          name,
          price,
          quantity,
          idCategory,
          idSubCategories,
          idShop,
          referenceClient,
          description,
          keywords,
        };
      },
    },
  ),
  updateProduct: update(
    Product,
    {
      id: GraphQLID,
      name: GraphQLString,
      price: GraphQLString,
      idCategory: GraphQLID,
      idSubCategories: new GraphQLList(GraphQLID),
      quantity: GraphQLInt,
      discount: GraphQLString,
      keywords: GraphQLString,
      description: GraphQLString,
      referenceClient: GraphQLString,
      image: new GraphQLList(GraphQLUpload),
    },
    ProductType,
    {
      authorizationRoles: [Role.ADMIN, Role.OWNER],
      pre: async (args, req) => {
        const { image, ...rest } = args;
        const priceAfterDiscount = await productService.priceAdjusment(args);

        if (image?.length) {
          // Deleting Old Photos
          const product = await productModel.findOne({ _id: rest.id }).select('image');
          // product?.image.forEach(async (img) => await uploadInstance.removeObject(img));
          // Uploading new Incomming Photos
          const shop = await Shop.findOne({ owner: req.user?._id });
          if (!shop) throw new GraphQLError('Cet utilisateur ne possede pas de boutique ');
          const id = `${shop?.owner}`;
          const productDest = `public/${shop?.name}_${id.slice(-5)}/`;

          return await Promise.all(
            image.map(async (file) => {
              if (file) return await uploadFileS3(productDest, file);
            }),
          ).then((res) => ({
            ...rest,
            image: product?.image.concat(res),
            priceAfterDiscount,
          }));
        } else return { ...rest, priceAfterDiscount };
      },
    },
  ),
  removeProduct: remove(Product, { authorizationRoles: [Role.ADMIN, Role.OWNER] }),
  deleteImage: apiWrapper(
    async (args) => {
      const { file, id } = args;
      const product = await Product.findById(id);
      const updatesArrayOdimages = product?.image.filter((img) => {
        if (!file?.includes(`${s3Url}/${img}`)) {
          return true;
        } else {
          uploadInstance.removeObject(img);
          return false;
        }
      }) as any;
      await Product.findByIdAndUpdate(id, {
        image: updatesArrayOdimages,
      });
      if (!product) throw new GraphQLError('invalid product id');

      return 'image deleted';
    },
    GraphQLString,
    {
      id: { type: GraphQLID },
      file: { type: GraphQLList(GraphQLString) },
    },
  ),
};
