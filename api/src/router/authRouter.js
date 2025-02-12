import express from "express";
import {
    requestEmailVerification,
    verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/request-email-verification", requestEmailVerification);
router.post("/verify-email", verifyEmail);

export default router;
