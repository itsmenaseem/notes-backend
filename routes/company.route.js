import { Router } from "express";
import { createCompany, getCompanyInfo } from "../controllers/company.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/").post(createCompany)
router.route("/:search").get(authMiddleware,getCompanyInfo)


export default router