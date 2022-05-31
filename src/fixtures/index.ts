import { connection, Model } from 'mongoose';
import connect from 'config/mongoose';
import bcrypt from 'bcryptjs';
import { env } from 'config/vars';

// user
import users from './users.json';
import categories from './categories.json';
import subCategories from './subCategories.json';
// import products from './products.json';
import User from 'models/user.model';
import Category from 'models/category.model';
import SubCategory from 'models/subCategory.model';
// import Product from 'models/product.model';
// import shops from './shops.json';
// import Shop from 'models/shop.model';

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(null), ms);
  });

const dropped: string[] = [];

async function generateDocs(documents: any[], model: Model<any>, counter?: number) {
  try {
    if (!dropped.find((name) => name === model.collection.name)) {
      await model.collection.drop();
      dropped.push(model.collection.name);
    }
    await model.insertMany(documents);
  } catch (e: any) {
    if (e.message === 'ns not found') {
      dropped.push(model.collection.name);
    }
    if (!counter || counter < 5) {
      await delay(1000);
      await generateDocs(documents, model, counter ? counter + 1 : 1);
    } else {
      console.log(e.message);
      process.exit(1);
    }
  }
}

async function generate() {
  await connect();

  /*** fixtures ***/
  if (env === 'development') {
    await generateDocs(
      users.map((user) => ({
        ...user,
        password: bcrypt.hashSync(user.password),
      })),
      User,
    );

    await generateDocs(
      categories.map((category) => ({ ...category })),
      Category,
    );

    await generateDocs(
      subCategories.map((subCategory) => ({ ...subCategory })),
      SubCategory,
    );
    // await generateDocs(
    //   products.map((product) => ({ ...product })),
    //   Product,
    // );
  }
  /*** fixtures ***/

  await connection.close();
  process.exit(0);
}

generate();
