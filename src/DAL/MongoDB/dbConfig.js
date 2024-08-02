import mongoose from "mongoose";
import config from "../../config.js";

const uri = config.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("Connected to the database"))
  .catch((error) => {
    console.error("Error connecting to database", error);
  });
