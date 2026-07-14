import { User } from "../models/userModel.js";

async function addToCart(req, res) {
  try {
    const { userId, productId, quantity, size, color, price, name, img } =
      req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!productId || !quantity || !size || !color || !price || !name || !img) {
      return res.status(400).json({
        message:
          "productId, quantity, size, color, price, name and img are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productExist = user.cartItems.find(
      (item) => item.productId === productId
    );

    if (productExist) {
      productExist.quantity += quantity;
    } else {
      user.cartItems.push({
        productId,
        quantity,
        size,
        color,
        price,
        name,
        img,
      });
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
    const userId = req.query.userId || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.cartItems.findIndex(
      (item) => item._id.toString() === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({ message: "item not found" });
    }

    user.cartItems.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "productId and quantity required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = user.cartItems.find((item) => item.productId === productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quantity = quantity;
    await user.save();

    res.json({ message: "Quantities updated successfully", user });
  } catch (error) {
    console.error("Error updating quantities:", error);
    res.status(500).json({ message: "Failed to update quantities" });
  }
};

export default {
  addToCart,
  getCartItems,
  removeFromCart,
  updateProductQuantity,
};
