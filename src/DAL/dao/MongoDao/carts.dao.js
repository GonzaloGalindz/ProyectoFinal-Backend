import { ObjectId } from "mongodb";
import { cartsModel } from "../../MongoDB/models/carts.model.js";

class CartsMongo {
  constructor() {}

  async saveCart(cart) {
    await cart.save();
    return cart;
  }

  async findAll() {
    const carts = await cartsModel.find().lean();
    return carts;
  }

  async findById(cid) {
    const cart = await cartsModel
      .findById(cid)
      .populate("products._id", [
        "title",
        "price",
        "description",
        "code",
        "stock",
        "quantity",
      ])
      .lean();
    return cart;
  }

  async createOne(initialCart = []) {
    const newCart = await cartsModel.create({
      products: initialCart,
    });
    const savedCart = await this.saveCart(newCart);
    return savedCart;
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await cartsModel.findById({ _id: cid });
      if (!cart) {
        throw new Error("Cart not found");
      }
      const pidObjectId = new ObjectId(pid);
      const existingProduct = cart.products.find((p) =>
        p._id.equals(pidObjectId)
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ _id: pidObjectId, quantity: 1 });
      }
      await this.saveCart(cart);
      return cart.products.find((p) => p._id.equals(pidObjectId));
    } catch (error) {
      return error;
    }
  }

  async updateProductInCart(cid, pid, newQuantity) {
    try {
      const cart = await cartsModel.findById({ _id: cid });
      if (!cart) {
        throw new Error("Cart not found");
      }
      const pidObjectId = new ObjectId(pid);
      const product = cart.products.find((p) => p._id.equals(pidObjectId));

      if (!product) {
        throw new Error("Product not found in this cart");
      }
      product.quantity = newQuantity;
      await this.saveCart(cart);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async deleteProductInCart(cid, pid) {
    try {
      const cart = await cartsModel.findById({ _id: cid });
      if (!cart) throw new Error("Cart not found");
      const pidObjectId = new ObjectId(pid);
      cart.products = cart.products.filter((p) => !p._id.equals(pidObjectId));
      await this.saveCart(cart);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async deleteCart(cid) {
    const cart = await cartsModel.findByIdAndDelete(cid);
    if (!cart) throw new Error("Cart not found");
    return cart;
  }
}

export const cartsManagerMongo = new CartsMongo();
