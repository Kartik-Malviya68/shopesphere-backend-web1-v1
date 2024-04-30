import { Router } from "express";
import userControllers from "../controllers/userControllers.js";
import getUserData from "../controllers/getUserData.js";
import { verifyJWT } from "../middlewares/authMddleware.js";
import cartControllers from "../controllers/cartControllers.js";
import stripe from "stripe";
import { StripeControll } from "../controllers/stripeControllers.js";

const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.route("/stripe/create-checkout-session").post(StripeControll);
router.route("/register").post(userControllers.registerUser);
router.route("/getUserData").get(getUserData);
router.route("/login").post(userControllers.loginUser);
router.route("/addToCart").post(verifyJWT, cartControllers.addToCart);
router.route("/getCartItems").get(verifyJWT, cartControllers.getCartItems);
router
  .route("/removeFromCart/:id")
  .delete(verifyJWT, cartControllers.removeFromCart);
//secure routes
router.route("/updateProductQuantity").put(verifyJWT, cartControllers.updateProductQuantity);
router.route("/logout").post(verifyJWT, userControllers.logoutUser);
router.route("/refreshAccessToken").post(userControllers.refreshAccessToken);
router
  .route("/checkTokenExpiry")
  .post(verifyJWT, userControllers.checkTokenExpiry);
export default router;
