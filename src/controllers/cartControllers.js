import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "productId and quantity required" });
    }
    const user = req.user;
    const productIndex = user.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex >= 0) {
      user.cartItems[productIndex].quantity += quantity;
    } else {
      user.cartItems.push({ productId, quantity });
    }
    await user.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

export default { addToCart };
