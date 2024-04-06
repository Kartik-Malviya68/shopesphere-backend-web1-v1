import dotenv from "dotenv";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";

async function generateAccessRefreshToken(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshtoken = user.refreshAccessToken();
    user.refreshtoken = refreshtoken;
    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshtoken };
  } catch (error) {
    console.log(error);
  }
}

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  const requiredFields = (username, email, password);
  if (!requiredFields) {
    return res.status(400).json({
      message:
        "fullname, username, email, phonenumber and password are required",
    });
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const user = await User.create({
    username,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select("-password ");

  if (!createdUser) {
    return res.status(500).json({
      message: "User not created",
    });
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdUser,
        `${createdUser.username} you are account successfully registred `
      )
    );
};

const loginUser = async (req, res) => {
  const { password, email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email required" });
  }
  if (!password) {
    return res.status(400).json({ message: "password required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }
  const checkpassword = bcrypt.compare(password, user.password);

  if (!checkpassword) {
    return res.status(400).json({ message: "Invalid password" });
  }
  // const verifyJWT = jwt.verify(
  //   user.refreshtoken,
  //   process.env.REFRESH_TOKEN_SECRET
  // );
  // if (!verifyJWT) {
  //   return res.status(401).json({ message: "Unauthorized token access" });
  // }
  const { accessToken, refreshtoken } = await generateAccessRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.status(200).json({
    message: "User logged in successfully",
    loggedInUser,
    accessToken,
    refreshtoken,
  });
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshAccessToken: undefined,
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshAccessToken", options)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingAccessToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingAccessToken) {
      return res.status(401).json({ message: "Unauthorized token access" });
    }
    const decoded = jwt.verify(
      incomingAccessToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = User.findById(decoded?._id);
    if (!user) {
      return res.status(401).json({ message: "invalid refreash token access" });
    }

    if (incomingAccessToken !== user?.refreshtoken) {
      return res.status(401).json({ message: "invalid refreash token access" });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshAccessToken } =
      await generateAccessRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshAccessToken", newRefreshAccessToken, options)
      .json({
        message: "User logged in successfully",
        accessToken,
        newRefreshAccessToken,
      });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized token access" });
  }
};

const checkTokenExpiry = async (res, req, next) => {
  const { incomingAccessToken } =
    req.cookies.accessToken || req.body.accessToken;
  console.log(incomingAccessToken);
  if (!incomingAccessToken) {
    return res.status(401).json({ message: "Unauthorized token access" });
  }
  const decoded = jwt.verify(
    incomingAccessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (!decoded) {
    return res
      .status(401)
      .json({ message: "decoded Unauthorized token access" });
  }
  next();
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  checkTokenExpiry,
};
