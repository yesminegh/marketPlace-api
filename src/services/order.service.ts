import orderModel, { Order } from 'models/order.model';
import OrderDetailModel, { OrderDetail } from 'models/orderDetail.model';
import productModel from 'models/product.model';
import productService from 'services/product.service';
import clientSchema, { Client } from 'models/client.model';
import userModel, { Role } from 'models/user.model';
import { GraphQLError } from 'graphql';
import couponClient from 'models/couponClient';
import { Schema } from 'mongoose';
import cartModel from 'models/cart.model';
import favoriteModel from 'models/favoriteModel';

class OrderService {
  model: typeof orderModel;
  constructor() {
    this.model = orderModel;
  }
  async priceAdjusment(args: Partial<Order>) {
    const { valuePromoCode, details, deliveryCosts } = args;
    const newDetails = await OrderDetailModel.find({ _id: { $in: details } });
    let price = 0;
    newDetails.map((e) => {
      price += parseFloat(e.totalPrice);
    });
    const subTotalPrice = price.toString();
    // const totalPrice = `${parseFloat(args.totalPrice) + parseFloat(deliveryCosts || '7')}`;

    return {
      subTotalPrice,
      // totalPrice,
    };
  }

  async priceDetailsAdjusment(args: Partial<OrderDetail>) {
    const { quantity, idProduct } = args;
    const product = await productModel.findById(idProduct);
    return product ? parseInt(product.priceAfterDiscount || '') * quantity! : '';
  }

  async createDetails(details: OrderDetail[]) {
    return Promise.all(
      details.map(async (_detail) => {
        const totalPrice = await this.priceDetailsAdjusment(_detail);
        const { _id } = await OrderDetailModel.create({ ..._detail, totalPrice });
        await productService.updateProductQuantity(_detail.idProduct, _detail);

        return _id;
      }),
    );
  }

  async createOrUpdateClient(args: Partial<Order>, clientInfo: Partial<Client>, totalPrice: string, User: string) {
    const { client, idShop } = args;

    const clientModel = await clientSchema.findOne({ _id: client });

    if (!clientModel) {
      const { _id } = await clientSchema.create({
        totalAmountPaid: totalPrice,
        ...clientInfo,
        idsShops: [idShop],
        user: User,
      });
      return _id;
    } else {
      clientModel.address = clientInfo.address || '';
      clientModel.totalAmountPaid = `${(
        parseFloat(clientModel.totalAmountPaid || '0') + parseFloat(totalPrice)
      ).toFixed(3)}`;
      clientModel.idsShops.push(idShop!);
      clientModel.save();
      return clientModel._id;
    }
  }
  async createUser(password: Partial<Order>, clientInfo: Partial<Client>) {
    const { fullName, address, telephone, email } = clientInfo;

    const existEmail = await userModel.findOne({ email });
    if (password && existEmail && existEmail.email === email) throw new GraphQLError("L'adresse e-mail existe déjà");
    else {
      if (password) {
        const User = await userModel.create({
          password: password,
          fullName,
          address,
          telephone,
          email,
          role: Role.CLIENT,
        });
        const NewFavoriteList = new favoriteModel({ idUser: User.id });
        await NewFavoriteList.save();
        const NewCart = new cartModel({ idUser: User.id });
        await NewCart.save();
        return User;
      } else return null;
    }
  }

  async createCouponClient(idCoupon: Schema.Types.ObjectId, client: Schema.Types.ObjectId) {
    const coupon = await couponClient.findOne({ idCoupon: idCoupon!, idClient: client! });
    if (!coupon) {
      await couponClient.create({
        idCoupon: idCoupon,
        used: 1,
        idClient: client,
      });
    } else {
      coupon.used = coupon.used + 1;
      coupon.save();
    }
  }
  async createOrder(
    args: Partial<Order>,
    password: Partial<Order>,
    clientInfo: Partial<Client>,
    idCoupon: Schema.Types.ObjectId,
  ) {
    const priceAdjusment = await this.priceAdjusment(args);

    const User = await this.createUser(password, clientInfo);

    const client = await this.createOrUpdateClient(args, clientInfo, args.totalPrice!, User?._id);
    await this.createCouponClient(idCoupon, client);
    const newOrder = new this.model({
      ...args,
      ...priceAdjusment,
      client,
      reference: (Math.floor(Math.random() * 99999999) + Date.now()).toString().slice(-9),
    });
    return { order: await newOrder.save(), user: User, idClient: client };
  }
}

export default new OrderService();
