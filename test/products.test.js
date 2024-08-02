import { expect } from "chai";
import { describe, it, before, after } from "mocha";
import mongoose from "mongoose";
import supertest from "supertest";
import config from "../src/config.js";

const requester = supertest("http://localhost:8080");
const uri = config.MONGO_URI;

const connDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (error) {
    console.log(`Error connecting to DB: ${error}`);
  }
};
connDB();

describe("Pruebas al router products", function () {
  this.timeout(20000);

  after(async () => {
    await mongoose.connection
      .collection("products")
      .deleteMany({ code: "testing" });
    await mongoose.disconnect();
  });

  it("El método get retorna un arreglo de productos", async () => {
    let { body } = await requester.get("/api/products");

    expect(body.response).to.be.an("array");
    expect(body.response[0]).to.have.property("_id");
  });

  it("La ruta /api/products con su método POST, permite crear un producto", async () => {
    let productMock = {
      title: "Product testing",
      description: "description product testing",
      price: 999,
      code: "testing",
      stock: 100,
    };

    let { body, status } = await requester
      .post("/api/products")
      .send(productMock);

    expect(status).to.be.oneOf([200, 201]);
    expect(body).to.have.property("response");
    expect(body.response).to.have.property("_id");
  });

  it("La ruta /api/products con su método POST, si falta un campo, devuelve status code 400", async () => {
    let productMock = {
      title: "Product testing",
      description: "description product testing",
      code: "testing",
      stock: 100,
    };

    let { status } = await requester.post("/api/products").send(productMock);

    expect(status).to.be.eq(400);
  });
});
