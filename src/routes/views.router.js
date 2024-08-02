import { Router } from "express";
import { productsManagerMongo } from "../DAL/dao/MongoDao/products.dao.js";
import { cartsManagerMongo } from "../DAL/dao/MongoDao/carts.dao.js";
import { auth, isAdmin, isUser } from "../middlewares/auth.js";
import { addProductToCart } from "../controllers/carts.controller.js";
import { cartsService } from "../services/carts.service.js";

const router = Router();

router.get("/chat", isUser, (req, res) => {
  res.render("chat");
});

router.get("/", async (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/products", auth, async (req, res) => {
  const products = await productsManagerMongo.findProducts();
  let usuario = req.session.user;
  res.render("products", { products, usuario });
});

router.get("/realtimeproducts", isAdmin, async (req, res) => {
  const products = await productsManagerMongo.findProducts();
  let usuario = req.session.user;
  res.render("products", { products, usuario });
});

router.get("/product/:pid", auth, async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsManagerMongo.findById(pid);
    if (!product) {
      res.status(400).json({ msg: "Product not found" });
    }
    res.render("viewProduct", { product });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/cart/:cid", auth, async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsManagerMongo.findById(cid);
    if (!cart) {
      res.status(400).json({ msg: "Cart not found" });
    }
    res.render("cart", { products: cart.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
