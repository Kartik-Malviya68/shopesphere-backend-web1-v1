import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new res.status(401).json({ message: "Unauthorized token access" });
    }

    const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedTokenInfo?._id).select(
      "-password -refreshtoken"
    );

    if (!user) {
      throw new res.status(401).json({ message: "Unauthorized token access" });
    }

    req.user = user;
    next();
  } catch (error) {
    throw new res.status(401).json({ message: "Unauthorized token access" });
  }
};
