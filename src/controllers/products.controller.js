import { productsService } from "../services/products.service.js";
import CustomError from "../errors/custom.error.js";
import { ErrorMessages } from "../errors/errorNum.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productsService.findProducts();
    res.status(200).json({ message: "Products", response: products });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.GET_PRODUCTS_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};

export const getProductById = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productsService.findById(pid);
    res.status(200).json({ message: "Product By Id", response: product });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.PRODUCT_NOT_FOUND
    );
    return res.status(customError.status).json(customError);
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await productsService.createProduct(req.body);
    res
      .status(201)
      .json({ message: "New product created", response: newProduct });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.CREATE_PRODUCT_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};

export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const updatedProduct = await productsService.updateProduct(pid, req.body);
    res
      .status(200)
      .json({ message: "Product updated", response: updatedProduct });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.UPDATE_PRODUCT_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};

export const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const deletedProduct = await productsService.deleteProduct(pid);
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    const customError = CustomError.createError(
      ErrorMessages.DELETE_PRODUCT_ERROR
    );
    return res.status(customError.status).json(customError);
  }
};
