import { Router } from "express";
import { usersManagerMongo } from "../DAL/dao/MongoDao/users.dao.js";
import { hashData, compareData } from "../utils.js";
import UsersDto from "../DAL/dto/users.dto.js";
import passport from "passport";
import { usersModel } from "../DAL/MongoDB/models/users.model.js";
import { cartsModel } from "../DAL/MongoDB/models/carts.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "Some data is missing" });
  }
  const userDB = await usersManagerMongo.findUser({ email });
  if (userDB) {
    return res.status(400).json({ message: "Email already used" });
  }
  const hashPassword = await hashData(password);
  const newUser = await usersManagerMongo.createUser({
    ...req.body,
    password: hashPassword,
    cart: await cartsModel.create({ products: [], productsNotPurchased: [] }),
  });
  res.status(200).json({ message: "User created successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Some data is missing" });
  }
  const userDB = await usersManagerMongo.findUser({ email });
  if (!userDB) {
    return res.status(400).json({ message: "Signup first" });
  }
  const isPasswordValid = await compareData(password, userDB.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Email or Password not valid" });
  }

  const userConnection = await usersModel.findOneAndUpdate(
    { _id: userDB._id },
    { lastConnection: new Date() },
    { new: true }
  );

  req.session.user = userDB;

  if (userDB.role == "admin") {
    res.redirect("/realtimeproducts");
  } else {
    res.redirect("/products");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      return res
        .status(500)
        .send({ status: "Error", error: "Error when closing transfer" });
    }
    res.redirect("/login");
  });
});

router.get("/errorRegister", (req, res) => {
  return res.status(500).json({
    status: "Error",
    error: `Error registering`,
  });
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/errorRegister",
  }),
  async (req, res) => {
    res.status(200).json({ message: "User created successfully" });
  }
);

router.get("/errorLogin", (req, res) => {
  return res.status(500).json({
    status: "Error",
    error: `Login error`,
  });
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/errorLogin",
  }),
  async (req, res) => {
    let user = req.user;
    user = { ...user };
    res.status(200).json({
      message: "Login successfully",
      user,
    });
  }
);

router.get("/github", passport.authenticate("github", {}), (req, res) => {});

router.get(
  "/callbackGithub",
  passport.authenticate("github", {
    failureRedirect: "/api/sessions/errorGitHub",
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

router.get("/errorGitHub", (req, res) => {
  return res.status(500).json({
    status: "Error",
    error: `Failed to authenticate with GitHub`,
  });
});

router.get("/current", (req, res) => {
  const userDto = new UsersDto(req.session.user);
  if (userDto) {
    res.status(200).json({ message: "Profile information", user: userDto });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

export default router;
