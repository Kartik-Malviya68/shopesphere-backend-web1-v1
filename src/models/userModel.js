import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config({
  path: ".env",
});
const userModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    passward: {
      type: String,
      required: true,
      trim: true,
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    refreshtoken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("passward")) return next();
  this.passward = await bcrypt.hashSync(this.passward, 10);
  next();
});

userModel.methods.ispasswardMatch = async function (passward) {
  return await bcrypt.compare(passward, this.passward);
};

userModel.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      passward: this.passward,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return accessToken;
};

bcrypt;

userModel.methods.refreshAccessToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  return refreshToken;
};
export const User = mongoose.model("Users", userModel);
