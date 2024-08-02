import { cartsManagerMongo } from "../DAL/dao/MongoDao/carts.dao.js";
import { productsManagerMongo } from "../DAL/dao/MongoDao/products.dao.js";

class CartsService {
  constructor() {}

  async findAll() {
    const carts = await cartsManagerMongo.findAll();
    return carts;
  }

  async findById(cid) {
    const cart = await cartsManagerMongo.findById(cid);
    return cart;
  }

  async createCart() {
    const newCart = await cartsManagerMongo.createOne();
    return newCart;
  }

  async deleteCart(cid) {
    const deletedCart = await cartsManagerMongo.deleteCart(cid);
    return deletedCart;
  }

  async addProductToCart(cid, pid) {
    const productInCart = await cartsManagerMongo.addProductToCart(cid, pid);
    return productInCart;
  }

  async updateProductInCart(cid, pid, newQuantity) {
    const productUpdateInCart = await cartsManagerMongo.updateProductInCart(
      cid,
      pid,
      newQuantity
    );
    return productUpdateInCart;
  }

  async deleteProductInCart(cid, pid) {
    const productDeleteInCart = await cartsManagerMongo.deleteProductInCart(
      cid,
      pid
    );
    return productDeleteInCart;
  }

  async calculateTotalAmount(cid) {
    try {
      const cart = await cartsManagerMongo.findById(cid);

      if (!cart) {
        throw new Error("Cart not found");
      }

      let totalAmount = 0;
      for (const productInfo of cart.products) {
        const product = await productsManagerMongo.findById(
          productInfo.product
        );
        if (product) {
          totalAmount += product.price * productInfo.quantity;
        }
      }

      cart.totalAmount = totalAmount;
      await cartsManagerMongo.saveCart(cart);
      return cart;
    } catch (error) {
      throw new Error("Error calculating total: " + error.message);
    }
  }
}

export const cartsService = new CartsService();
