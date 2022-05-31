import { connection } from 'mongoose';
import connect from 'config/mongoose';
import SubCategoryModel from './../models/subCategory.model';
import categoryModel from 'models/category.model';
import shopModel from 'models/shop.model';

async function generate() {
  await connect();
  const data = await shopModel.find();
  console.log({ data: JSON.stringify(data) });

  await connection.close();
  process.exit(0);
}

generate();
