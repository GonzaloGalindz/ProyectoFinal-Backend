import { expect } from "chai";
import { describe, it } from "mocha";
import mongoose from "mongoose";
import supertest from "supertest-session";
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

describe("Pruebas al router carts", function () {
  this.timeout(20000);

  after(async () => {
    await mongoose.connection
      .collection("carts")
      .deleteMany({ totalAmount: 10000 });
  });

  it("El método get retorna un arreglo de carritos", async () => {
    let resultado = await requester.get("/api/carts");

    expect(resultado._body.response).to.be.an("array");
    expect(resultado._body.response[0]).to.have.property("_id");
  });

  it("La ruta /api/carts con su método POST, permite crear un cart", async () => {
    let cartMock = {
      products: [
        { _id: "6609984e411a2bed8d7de999", quantity: 5 },
        { _id: "6609986b411a2bed8d7de99b", quantity: 2 },
      ],
      totalAmount: 10000,
    };

    let { body, status } = await requester.post("/api/carts").send(cartMock);

    expect(status).to.be.oneOf([200, 201]);
    expect(body).has.property("response");
    expect(body.response).has.property("_id");
  });
});
