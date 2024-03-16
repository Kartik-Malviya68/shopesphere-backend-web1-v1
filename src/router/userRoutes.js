import { Router } from "express";
import userControllers from "../controllers/userControllers.js";
import getUserData from "../controllers/getUserData.js";
import { verifyJWT } from "../middlewares/authMddleware.js";
import cartControllers from "../controllers/cartControllers.js";


const router = Router();
router.route("/register").post(userControllers.registerUser);
router.route("/getUserData").get(getUserData);
router.route("/login").post(userControllers.loginUser);
router.route("/addToCart").post(verifyJWT, cartControllers.addToCart);

//secure routes
router.route("/logout").post(verifyJWT, userControllers.logoutUser);
router.route("/refreshAccessToken").post(userControllers.refreshAccessToken);
export default router;
    