import { json } from "express";
import { User } from "../models/userModel.js";

const getUserData = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.json(users);
    JSON.stringify(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default getUserData;
