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
    password: {
      type: String,
      required: true,
      trim: true,
    },

    refreshtoken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hashSync(this.password, 10);
  next();
});

userModel.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userModel.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      password: this.password,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return accessToken;
};

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
