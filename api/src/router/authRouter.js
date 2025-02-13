import express from "express";
import { authenticate } from "../utils/authenticater.js";
import {
    requestEmailVerification,
    verifyEmail,
    changePassword,
    passwordInit,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/request-email-verification", requestEmailVerification);
router.post("/verify-email", verifyEmail);
router.post("/change-password", authenticate, changePassword);
router.post("/password-init", authenticate, passwordInit);

export default router;
