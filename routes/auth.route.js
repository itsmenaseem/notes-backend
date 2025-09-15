
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getProfile, login, logout, signup } from "../controllers/auth.controller.js";
import { authRateLimter } from "../middlewares/rate-limit.middleware.js";

const router = Router()


router.route("/signup").post(authRateLimter,signup);
router.route("/login").post(authRateLimter,login);
router.route("/me").get(authMiddleware,getProfile)
router.route("/logout").get(logout)

export default router