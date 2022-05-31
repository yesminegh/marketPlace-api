/* eslint-disable @typescript-eslint/no-non-null-assertion */
import get from 'crud/get';
import list from 'crud/list';
import { GraphQLError, GraphQLString, GraphQLID } from 'graphql';

import Product from 'models/product.model';
import shopModel from 'models/shop.model';

import { ProductType } from 'types/product.type';
import { reg } from 'utils/regs';

interface ProductsArguments {
  search: string;
  idShop?: string;
  idCategory?: string;
  promotion?: string;
  subCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  $or: any;
}
interface ProductsArgumentsClient {
  search?: string;
  idCategory?: string;
  subCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  promo?: string;
  idShop: string;
  $or: any;
  shopSlug?: string;
}

const getProductsArguments = async (
  { search, idCategory, promotion, subCategory, minPrice, maxPrice, ...args }: ProductsArguments,
  req: any,
) => {
  const query: any = { ...args };
  if (req.user?.idShop) query.idShop = req?.user.idShop;
  else if (req.user && req.user.role === 'owner') throw new GraphQLError('Veuillez cree une boutique');
  if (idCategory) query.idCategory = idCategory;
  if (promotion === 'true') query.discount = { $ne: '' };
  if (promotion === 'false') query.discount = { $eq: '' };

  if (subCategory) {
    query.idSubCategories = { $in: subCategory.split(',') };
  }

  if (minPrice) {
    const products = await Product.find();
    const tab = products.filter(
      (ele) =>
        parseFloat(ele.priceAfterDiscount) >= parseFloat(minPrice) &&
        parseFloat(ele.priceAfterDiscount) <= parseFloat(maxPrice!),
    );

    query.price = {
      $in: tab.map((ele) => {
        return ele.price;
      }),
    };
  }
  if (search) {
    query['$or'] = search
      .trim()
      .split(' ')
      .map((term: string) => ({
        ...{ $or: [{ name: reg(term) }, { keywords: reg(term) }] },
      }));
  }

  return query;
};
const getProductsClientArguments = async ({
  search,
  $or,
  minPrice,
  maxPrice,
  subCategory,
  promo,
  shopSlug,
  ...args
}: ProductsArgumentsClient) => {
  const query: any = { ...args };
  const shop = await shopModel.findOne({ slug: shopSlug });

  query.idShop = shop?._id;
  if (search) {
    query['$or'] = search
      .trim()
      .split(' ')
      .map((term: string) => ({
        ...{ $or: [{ name: reg(term) }, { keywords: reg(term) }] },
      }));
  }
  if (subCategory) {
    query.idSubCategories = { $in: [subCategory] };
  }

  if (minPrice) {
    const products = await Product.find({ idShop: query.idShop });
    const tab = products.filter(
      (ele) =>
        parseFloat(ele.priceAfterDiscount) >= parseFloat(minPrice) &&
        parseFloat(ele.priceAfterDiscount) <= parseFloat(maxPrice!),
    );

    query.price = {
      $in: tab.map((ele) => {
        return ele.price;
      }),
    };
  }
  if (promo) {
    query.discount = { $ne: '' };
  }

  return query;
};

export default {
  products: list(Product, ProductType, {
    args: {
      search: { type: GraphQLString },
      idCategory: { type: GraphQLString },
      promotion: { type: GraphQLString },
      subCategory: { type: GraphQLString },
      minPrice: { type: GraphQLString },
      maxPrice: { type: GraphQLString },
    },
    authorizationRoles: [],
    pre: getProductsArguments as any,
  }),
  productsClientSearch: list(Product, ProductType, {
    args: {
      search: { type: GraphQLString },
      idShop: { type: GraphQLID },
      shopSlug: { type: GraphQLString },
      idCategory: { type: GraphQLID },
      subCategory: { type: GraphQLString },
      minPrice: { type: GraphQLString },
      maxPrice: { type: GraphQLString },
      promo: { type: GraphQLString },
    },
    authorizationRoles: [],
    pre: getProductsClientArguments as any,
  }),
  product: get(Product, ProductType, { authorizationRoles: [] }),
};
