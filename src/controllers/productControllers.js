import { Sneaker } from "../models/sneakersModel.js";

const ProductController = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      color,
      image,
      category,
      description,
      genderType,
      rating,
      style,
    } = req.body;

    const sneaker = await Sneaker.create({
      name,
      brand,
      price,
      color,
      image,
      category,
      description,
      genderType,
      rating,
      style,
    });

    return res.status(201).json({
      message: "Sneaker created successfully",
      sneaker,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Sneaker not created",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Sneaker.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.json(products);
    JSON.stringify(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Sneaker.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
    JSON.stringify(product);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Sneaker.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
    JSON.stringify(product);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Sneaker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
    JSON.stringify(product);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const getProductsByFilter = async (req, res) => {
//   try {
//     let matchQuery = {};
//     if (req.body.brands && req.body.brands.length > 0) {
//       matchQuery.brand = { $in: req.body.brands };
//     }
//     if (req.body.categories && req.body.categories.length > 0) {
//       matchQuery.category = { $in: req.body.categories };
//     }
//     const products = await Sneaker.aggregate([{ $match: matchQuery }]);
//     if (!products || products.length === 0) {
//       return res.status(404).json({ error: "No products found" });
//     }
//     res.json(products);
//     JSON.stringify(products);
//   } catch (error) {
//     console.error("Error retrieving products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getProductsByFilter = async (req, res) => {
  try {
    let matchQuery = {};
    if (req.query.brands && req.query.brands.length > 0) {
      matchQuery.brand = { $in: req.query.brands.split(",") };
    }
    if (req.query.style && req.query.style.length > 0) {
      matchQuery.style = { $in: req.query.style.split(",") };
    }

    if (req.query.genderType && req.query.genderType.length > 0) {
      matchQuery.genderType = { $in: req.query.genderType.split(",") };
    }
    if (req.query.color && req.query.color.length > 0) {
      matchQuery.color = { $in: req.query.color.split(",") };
    }
    if (req.query.price && req.query.price.length > 0) {
      const priceRange = req.query.price.split(" - ");
      console.log(priceRange);
      if (priceRange.length === 2) {
        console.log(priceRange[0]);
        matchQuery.price = {
          $gte: priceRange[0],
          $lte: priceRange[1],
        };
      } else {
        throw new Error("Invalid price range format");
      }
    }

    const products = await Sneaker.aggregate([{ $match: matchQuery }]);
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductBySearch = async (req, res) => {
  try {
    const products = await Sneaker.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.json(products);
    JSON.stringify(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  ProductController,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductsByFilter,
  getProductBySearch,
};
