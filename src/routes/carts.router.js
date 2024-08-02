import { Router } from "express";
import { isUser } from "../middlewares/auth.js";
import {
  addProductToCart,
  createCart,
  deleteCart,
  deleteProductInCart,
  getCartById,
  getCarts,
  purchaseCart,
  updateProductInCart,
} from "../controllers/carts.controller.js";

const router = Router();

router.get("/", getCarts);

router.get("/:cid", getCartById);

router.post("/", createCart);

router.post("/add", addProductToCart);

router.delete("/:cid", deleteCart);

router.post("/:cid/products/:pid", isUser, addProductToCart);

router.put("/:cid/products/:pid", updateProductInCart);

router.delete("/:cid/products/:pid", deleteProductInCart);

router.post("/:cid/purchase", purchaseCart);

export default router;
