import { Router } from "express";
import { takeScreenshot } from "../controllers/screenshotAPI.controller.js";

const router=Router();

router.route("/screenshot").post(takeScreenshot)

export default router