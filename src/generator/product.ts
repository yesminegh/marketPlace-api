import { connection } from 'mongoose';
import connect from 'config/mongoose';
import SubCategoryModel from './../models/subCategory.model';
import categoryModel from 'models/category.model';
import shopModel from 'models/shop.model';

import categories from '../fixtures/categories.json';
import subcategories from '../fixtures/subCategories.json';
import shops from '../fixtures/shops.json';
import productModel from 'models/product.model';

const random = (n: number) => Math.floor(Math.random() * n);

async function generate() {
  await connect();

  const elemnts = await [...new Array(100)].map((e, i) => {
    const categoriess = [...new Array(random(5) + 1)].map((e) => subcategories[random(subcategories.length)]._id);
    return {
      name: `name ${i}`,
      price: `price ${i}`,
      idCategory: categories[random(categories.length)]._id,
      idSubCategories: categoriess,
      quantity: random(1000),
      discount: `discount ${i}`,
      keywords: `keywords ${i}`,
      description: `description ${i}`,
      referenceCode: `referenceCode ${i}`,
      image: ['https://erasmusnation-com.ams3.digitaloceanspaces.com/woocommerce-placeholder.png'],
      idShop: shops[random(shops.length)]._id,
    };
  });

  const data = await productModel.insertMany(elemnts).then((values) => {
    console.log({ values: JSON.stringify(values) });
  });

  await connection.close();
  process.exit(0);
}

generate();
