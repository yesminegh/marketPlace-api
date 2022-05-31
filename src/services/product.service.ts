import { GraphQLError } from 'graphql';
import { OrderDetail } from 'models/orderDetail.model';
import productModel, { Product } from 'models/product.model';
import { ObjectId } from 'mongoose';

class ProductService {
  model: typeof productModel;
  constructor() {
    this.model = productModel;
  }

  async priceAdjusment(args: Partial<Product>) {
    const { discount, price } = args;
    return `${(parseFloat(price!) * ((100 - parseFloat(discount || '0')) / 100)).toFixed(3)} `;
  }

  async createProductArgs(args: Partial<Product>) {
    const priceAfterDiscount = await this.priceAdjusment(args);
    return {
      ...args,
      priceAfterDiscount,
      referenceCode: (Math.floor(Math.random() * 99999999) + Date.now()).toString().slice(-9),
    };
  }

  async quantityAdjusment(args: Partial<OrderDetail>) {
    const { quantity, idProduct } = args;
    const product = await productModel.findById(idProduct);
    if (!product) throw new GraphQLError('invalid id product');

    if (quantity! > product.quantity) {
      throw new GraphQLError(
        `L'article (${product.name}) n'est plus disponible dans cette quantité. Vous ne pouvez pas continuer votre commande avant d'avoir ajusté la quantité.`,
      );
    } else return product.quantity - (quantity || 0);
  }
  async updateProductQuantity(id: ObjectId, args: Partial<Product>) {
    const quantity = await this.quantityAdjusment(args);
    return this.model.findByIdAndUpdate(id, { quantity });
  }
}

export default new ProductService();
