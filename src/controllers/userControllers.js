import dotenv from "dotenv";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

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
  const { username, email, passward } = req.body;
  console.log(req.body);
  const requiredFields = (username, email, passward);
  if (!requiredFields) {
    return res.status(400).json({
      message:
        "fullname, username, email, phonenumber and passward are required",
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
    passward,
  });
  const createdUser = await User.findById(user._id).select(
    "-passward -refreshtoken "
  );

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
  try {
    const { email, passward, username } = req.body;
    if ((!email || !username) && !passward) {
      return res.status(400).json({
        message: "username or email or phonenumber and passward are required",
      });
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new Error(404, "User does not exist");
    }

    const { accessToken, refreshtoken } = await generateAccessRefreshToken(
      user._id
    );
    console.log("user._id", user._id);
    const loggedInUser = await User.findById(user._id).select(
      "-passward -refreshtoken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshAccessToken", refreshtoken, options)
      .json({
        message: "User logged in successfully",
        loggedInUser,
        accessToken,
        refreshtoken,
      });
  } catch (error) {
    console.log("error accurd", error);
  }
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
export default {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
};
