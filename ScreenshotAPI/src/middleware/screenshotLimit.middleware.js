import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { rateLimit } from 'express-rate-limit'

const limit = asyncHandler(
    rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 4,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: "Too many screenshot requests, try again in 1 minute"
        }
    })
)

export default limit