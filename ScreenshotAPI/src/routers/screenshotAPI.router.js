import { Router } from "express";
import { takeScreenshot } from "../controllers/screenshotAPI.controller.js";
import limit from "../middleware/screenshotLimit.middleware.js";

const router=Router();

router.route("/screenshot").post(limit, takeScreenshot)

export default router