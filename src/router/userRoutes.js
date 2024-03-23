import { Router } from "express";
import userControllers from "../controllers/userControllers.js";
import getUserData from "../controllers/getUserData.js";
import { verifyJWT } from "../middlewares/authMddleware.js";
import cartControllers from "../controllers/cartControllers.js";

const router = Router();
router.route("/register").post(verifyJWT, userControllers.registerUser);
router.route("/getUserData").get(getUserData);
router.route("/login").post(userControllers.loginUser);
router.route("/addToCart").post(verifyJWT, cartControllers.addToCart);
router.route("/getCartItems").get(verifyJWT, cartControllers.getCartItems);
router
  .route("/removeFromCart/:id")
  .delete(verifyJWT, cartControllers.removeFromCart);
//secure routes
router.route("/logout").post( userControllers.logoutUser);
router.route("/refreshAccessToken").post(userControllers.refreshAccessToken);
router.route("/checkTokenExpiry").post(verifyJWT, userControllers.checkTokenExpiry);
export default router;
