import { Router } from "express";
import productControllers from "../controllers/productControllers.js";

const router = Router();
router.route("/create").post(productControllers.ProductController);
router.route("/getAllProducts").get(productControllers.getAllProducts);
// router
//   .route("/getProductsByFilter")
//   .get(productControllers.getProductsByFilter);
router.route("/:id").get(productControllers.getProductById);
router.route("/del/:id").delete(productControllers.deleteProduct);
router.route("/update/:id").put(productControllers.updateProduct);
export default router
