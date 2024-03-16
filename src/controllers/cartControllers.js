import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
async function addToCart(req, res) {
  try {
    const { productId, quantity, size, color, price, name } = req.body;

    if (!productId || !quantity || !size || !color || !price || !name) {
      return res
        .status(400)
        .json({ message: "productId, quantity, size, color are required" });
    }
    const user = req.user;

    const productExist = user.cartItems.find(
      (item) => item.productId === productId
    );

    if (productExist) {
      productExist.quantity += quantity;
    }

    if (!productExist) {
      user.cartItems.push({ productId, quantity, size, color, price, name });
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

const getCartItems = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export default { addToCart, getCartItems };
