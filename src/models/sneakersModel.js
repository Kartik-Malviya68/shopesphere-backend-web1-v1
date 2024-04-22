import mongoose from "mongoose";

const sneakersModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      tolowercase: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      tolowercase: true,
    },
    price: {
      type: Number,
      required: true,
    },
    color: [{ type: String, tolowercase: true }],
    image: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    genderType: {
      type: String,
      required: true,
    },
    rating: {
      rating: String,
      ratingCount: String,
    },
    style: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Sneaker = mongoose.model("Product", sneakersModel);
