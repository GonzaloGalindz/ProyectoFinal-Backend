import { Router } from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/:pid", getProductById);

router.post("/", isAdmin, createProduct);

router.put("/:pid", isAdmin, updateProduct);

router.delete("/:pid", isAdmin, deleteProduct);

export default router;
