import { productsService } from "../services/products.service.js";
import { cartsService } from "../services/carts.service.js";
import { ticketsController } from "./tickets.controller.js";
import CustomError from "../errors/custom.error.js";
import { ErrorMessages } from "../errors/errorNum.js";

export const getCarts = async (req, res) => {
  try {
    const carts = await cartsService.findAll();
    res.status(200).json({ message: "Carts", response: carts });
  } catch (error) {
    const customError = CustomError.createError(ErrorMessages.GET_CARTS_ERROR);
    return res.status(customError.status).json(customError);
  }
};

export const getCartById = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartsService.findById({ _id: cid });
    res.status(200).json({ message: "Cart By Id", response: cart });
  } catch (error) {
    const customError = CustomError.createError(ErrorMessages.CART_NOT_FOUND);
    return res.status(customError.status).json(customError);
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await cartsService.createCart();
    res.status(201).json({ message: "New cart created", response: newCart });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.CREATE_CART_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};

export const deleteCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const deletedCart = await cartsService.deleteCart(cid);
    res.status(200).json({ message: "Cart removed" });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.DELETE_CART_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};

export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const productInCart = await cartsService.addProductToCart(cid, pid);
    res
      .status(202)
      .json({ message: "Product added to cart", response: productInCart });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.ADD_PRODUCT_TO_CART_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};

export const updateProductInCart = async (req, res) => {
  const { cid, pid } = req.params;
  const newQuantity = req.body.quantity;
  try {
    const productUpdateInCart = await cartsService.updateProductInCart(
      cid,
      pid,
      newQuantity
    );
    res.status(202).json({
      message: "Update product in the cart",
      response: productUpdateInCart,
    });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.UPDATE_PRODUCT_TO_CART_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};

export const deleteProductInCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const productDeleteInCart = await cartsService.deleteProductInCart(
      cid,
      pid
    );
    res.status(202).json({
      message: "Product removed from cart",
    });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.DELETE_PRODUCT_FROM_CART_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const cart = await cartsService.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let productsNotPurchased = [];

    for (const productInfo of cart.products) {
      const product = await productsService.findById(productInfo._id);
      if (product.stock < productInfo.quantity) {
        productsNotPurchased.push(productInfo.product);
        continue;
      } else {
        product.stock -= productInfo.quantity;
        await product.save();
      }
    }
    cart.productsNotPurchased = productsNotPurchased;

    await cartsService.calculateTotalAmount(cart);

    const ticket = await ticketsController.createTicket();
    await cart.save();

    res.status(201).json({
      message: "Successful purchase",
      ticket,
      productsNotPurchased,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
