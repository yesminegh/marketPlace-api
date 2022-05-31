import { GraphQLString, GraphQLList, GraphQLID, GraphQLError } from 'graphql';

import create from 'crud/create';
import update from 'crud/update';
import remove from 'crud/remove';

import path from 'path';
import fs from 'fs';

import Shop from 'models/shop.model';

import { ShopType } from 'types/shop.type';
import { GraphQLUpload } from 'graphql-upload';
import { uploadInstance } from 'utils/upload';
import apiWrapper from 'crud/apiWrapper';

// const refGen = (n: number) =>
//   [...new Array(n)]
//     .map(
//       () =>
//         'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
//           Math.floor(Math.random() * 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.length)
//         ],
//     )
//     .join('');

// const createShopValidation = {
//   name: joi.string().min(1).max(50).required(),
//   categories: joi
//     .array()
//     .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
//     .required(),
//   description: joi.string(),
//   slug: joi.string(),
//   accroche: joi.string(),
//   coverImage: joi.string(),
//   owner: joi
//     .string()
//     .regex(/^[0-9a-fA-F]{24}$/)
//     .required(),
//   logo: joi.string().required(),
// };

/* const updateShopValidation = {
  name: joi.string().min(1).max(50),
  categories: joi.array().items(joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  description: joi.string(),
  slug: joi.string(),
  accroche: joi.string(),
  coverImage: joi.string(),
  owner: joi.string().regex(/^[0-9a-fA-F]{24}$/),
}; */

export default {
  createShop: create(
    Shop,
    {
      name: { type: GraphQLString, required: true },
      categories: { type: new GraphQLList(GraphQLID), required: false },
      description: { type: GraphQLString, required: false },
      slug: { type: GraphQLString, required: false },
      accroche: { type: GraphQLString, required: false },
      coverImage: { type: GraphQLUpload, required: false },
      owner: { type: GraphQLID, required: false },
      logo: { type: GraphQLUpload, required: false },
    },
    ShopType,
    {
      validateSchema: {},
      authorizationRoles: [],
      pre: async (args) => {
        const { logo, coverImage, ...rest } = args;
        const gener = rest.owner.slice(-5);

        let logoImage = '';
        let ImageCover = '';

        const pathname = `public/${rest?.name}_${gener!.toString()}`;
        if (logo) {
          const { createReadStream, filename, mimetype } = await logo;
          const stream = createReadStream();

          const { url } = await uploadInstance.uploadStream(
            stream,
            `${pathname}/logo`,
            filename,
            mimetype,
            'public-read',
          );
          logoImage = url;
        }
        if (coverImage) {
          const { createReadStream, filename, mimetype } = await coverImage;
          const stream = createReadStream();

          const { url } = await uploadInstance.uploadStream(
            stream,
            `${pathname}/cover`,
            filename,
            mimetype,
            'public-read',
          );
          ImageCover = url;
        }
        return { ...rest, logo: logoImage, coverImage: ImageCover };
      },
      post: async ({ result: shop }) => {
        // shop.logo = serverUrl + '/uploads/' + shop.logo;
        // if (shop.coverImage) shop.coverImage = serverUrl + '/uploads/' + shop.coverImage;

        return shop;
      },
    },
  ),
  updateShop: update(
    Shop,
    {
      name: GraphQLString,
      categories: new GraphQLList(GraphQLID),
      description: GraphQLString,
      slug: GraphQLString,
      accroche: GraphQLString,
      coverImage: GraphQLUpload,
      owner: GraphQLID,
      logo: GraphQLUpload,
    },
    ShopType,
    {
      validateSchema: {},
      authorizationRoles: [],
      pre: async (args) => {
        const { id, logo, coverImage, ...rest } = args;
        let logoUrl = '';
        let coverUrl = '';
        let data: any = { ...rest };
        const shop = await Shop.findById(id);
        if (!shop) throw new GraphQLError('invalid shop id');
        const idOwner = shop?.owner;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pathname = `public/${shop?.name}_${idOwner!.toString()}`;
        if (logo) {
          const { createReadStream, filename, mimetype } = await logo;
          if (shop.logo) {
            await uploadInstance.removeObject(shop?.logo);
          }
          const stream = createReadStream();

          const { url } = await uploadInstance.uploadStream(
            stream,
            `${pathname}/logo`,
            filename,
            mimetype,
            'public-read',
          );
          logoUrl = url;
          data = { logo: logoUrl, ...data };
        }
        if (coverImage) {
          const { createReadStream, filename, mimetype } = await coverImage;
          if (shop.coverImage) {
            await uploadInstance.removeObject(shop?.coverImage);
          }
          if (filename) {
            const stream = createReadStream();
            const { url } = await uploadInstance.uploadStream(
              stream,
              `${pathname}/cover`,
              filename,
              mimetype,
              'public-read',
            );
            coverUrl = url;
            data = { coverImage: coverUrl, ...data };
          }
          return { id, ...data };
        } else {
          data = { coverImage: '', ...data };
          return { id, ...data };
        }
      },
    },
  ),
  deleteCoverImage: apiWrapper(
    async (args) => {
      const { id } = args;
      const shop = await Shop.findById(id);
      if (!shop) throw new GraphQLError('invalid product id');

      if (shop.coverImage) {
        await uploadInstance.removeObject(shop.coverImage);
        shop.coverImage = '';

        await shop.save();
      }

      return 'image deleted';
    },
    GraphQLString,
    {
      id: { type: GraphQLID },
    },
  ),
  removeShop: remove(Shop, {
    authorizationRoles: [],
    pre: async (args) => {
      const { id, ids } = args;
      if (ids) {
        ids.map(async (id: string) => {
          const shop = await Shop.findById(id);
          if (!shop) throw new GraphQLError(`invalid shop id :${id}`);
          const idOwner = `${shop?.owner}`;
          const dir = path.join(__dirname, '../../uploads/', `${shop?.name}_${idOwner.slice(-5)}`);
          fs.rmSync(dir, { recursive: true, force: true });
        });
      }
      if (id) {
        const shop = await Shop.findById(id);
        if (!shop) throw new GraphQLError(`invalid shop id :${id}`);
        const idOwner = `${shop?.owner}`;
        const dir = path.join(__dirname, '../../uploads/', `${shop?.name}_${idOwner.slice(-5)}`);
        fs.rmSync(dir, { recursive: true, force: true });
      }
      return args;
    },
  }),
};
