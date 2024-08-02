import { productsModel } from "../../MongoDB/models/products.model.js";

class ProductsMongo {
  constructor() {}

  async findProducts() {
    const products = await productsModel.find().lean();
    return products;
  }

  async findAll(obj) {
    const { limit = 10, page = 1 } = obj || {};
    const queryObject = obj?.query || {};

    const result = await productsModel.paginate(queryObject, {
      limit,
      page,
    });
    const info = {
      status: "Success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: `http://localhost:8080/api/products?page=${result.prevPage}`,
      nextLink: `http://localhost:8080/api/products?page=${result.nextPage}`,
    };
    return { info };
  }

  async findById(pid) {
    const product = await productsModel.findById(pid).lean();
    return product;
  }

  async createOne(obj) {
    const newProduct = await productsModel.create(obj);
    return newProduct;
  }

  async updateOne(pid, obj) {
    const updatedProduct = await productsModel.updateOne(
      { _id: pid },
      { ...obj }
    );
    return updatedProduct;
  }

  async deleteOne(pid) {
    const deletedProduct = await productsModel.findByIdAndDelete(pid);
    return deletedProduct;
  }
}

export const productsManagerMongo = new ProductsMongo();
