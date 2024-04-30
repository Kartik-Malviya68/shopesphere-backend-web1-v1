import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
async function addToCart(req, res) {
  try {
    const { productId, quantity, size, color, price, name, img } = req.body;

    if ((!productId || !quantity || !size || !color || !price || !name, !img)) {
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
    const user = req.user;
    res.status(200).json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const user = req.user;
    console.log(req.params.id);
    const index = user.cartItems.findIndex(
      (item) => item._id.toString() === req.params.id
    );

    if (index === -1) {
      return res.status(404).json({ message: "item not found" });
    }

    user.cartItems.splice(index, 1);

    await User.findByIdAndUpdate(user, { cartItems: user.cartItems });

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const product = await Sneaker.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: req.body.quantity } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default { addToCart, getCartItems, removeFromCart,updateProductQuantity };
