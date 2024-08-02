import { productsManagerMongo } from "../DAL/dao/MongoDao/products.dao.js";

class ProductsService {
  constructor() {}

  async findProducts() {
    const products = await productsManagerMongo.findProducts();
    return products;
  }

  async findAll(obj) {
    const products = await productsManagerMongo.findAll(obj);
    return products;
  }

  async findById(pid) {
    const product = await productsManagerMongo.findById(pid);
    return product;
  }

  async createProduct(obj) {
    const newProduct = await productsManagerMongo.createOne(obj);
    return newProduct;
  }

  async updateProduct(pid, obj) {
    const updatedProduct = await productsManagerMongo.updateOne(
      { _id: pid },
      { ...obj }
    );
    return updatedProduct;
  }

  async deleteProduct(pid) {
    const deletedProduct = await productsManagerMongo.deleteOne(pid);
    return deletedProduct;
  }
}

export const productsService = new ProductsService();
