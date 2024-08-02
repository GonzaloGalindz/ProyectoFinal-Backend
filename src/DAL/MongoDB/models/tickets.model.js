import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

export const ticketsModel = mongoose.model("Tickets", ticketsSchema);
