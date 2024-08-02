import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Server } from "socket.io";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { __dirname } from "./utils.js";
import config from "./config.js";
import "./DAL/MongoDB/dbConfig.js";
import "./config/passport.config.js";

import { generate100FakerProducts } from "./mocks/products.mock.js";
import { logger } from "./logger/winston.js";

import { productsManagerMongo } from "./DAL/dao/MongoDao/products.dao.js";
import { chatManagerMongo } from "./DAL/dao/MongoDao/chat.dao.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentation of the E-commerce Backend Project",
      description: "API Rest E-commerce 53110",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(cookieParser("SecretKeyCookies"));

app.use(
  session({
    store: new MongoStore({
      mongoUrl: config.MONGO_URI,
      ttl: 1800,
    }),
    secret: config.SESSIONSECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);

app.get("/api/mockingProducts", (req, res) => {
  const fakerProducts = [];
  for (let i = 0; i < 100; i++) {
    const productMocking = generate100FakerProducts();
    fakerProducts.push(productMocking);
  }
  res.status(200).json({ fakerProducts });
});

app.get("/api/loggerTest", (req, res) => {
  logger.fatal("Fatal"),
    logger.error("Error"),
    logger.warning("Warning"),
    logger.info("Info"),
    logger.http("Http"),
    logger.debug("Debug"),
    res.send("Logger winston test");
});

const httpServer = app.listen(config.PORT, () => {
  console.log(`Listening express server on port ${config.PORT}`);
});

const socketServer = new Server(httpServer);

const messages = [];

socketServer.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on("mensaje", async (infoMensaje) => {
    const newMessage = await chatManagerMongo.createOne(infoMensaje);
    const message = await chatManagerMongo.findAll();
    messages.push(newMessage);
    socketServer.emit("chat", message);
  });

  socket.on("usuarioNuevo", (usuario) => {
    socket.broadcast.emit("broadcast", usuario);
  });

  socket.on("agregar", async (objProd) => {
    const opAdd = await productsManagerMongo.createOne(objProd);
    const allProducts = await productsManagerMongo.findAll();
    if (opAdd) {
      socketServer.emit("added", allProducts);
    } else {
      socket.emit("added", allProducts);
    }
  });

  socket.on("eliminar", async (_id) => {
    const opDel = await productsManagerMongo.deleteOne(_id);
    const updatedProducts = await productsManagerMongo.findAll();
    if (opDel) {
      socketServer.emit("deleted", updatedProducts);
    } else {
      socket.emit("deleted", updatedProducts);
    }
  });
});
