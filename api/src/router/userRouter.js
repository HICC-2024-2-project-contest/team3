import express from "express";
import {
    register,
    login,
    refresh,
    logout,
    getUser,
    putUser,
    deleteUser,
    uploadProfileImageEndpoint,
    deleteProfileImageEndpoint,
    getFollowers,
    getReports,
    getBlocks,
    follow,
    unfollow,
    report,
    block,
    unblock,
} from "../controllers/userController.js";
import { authenticate } from "../utils/authenticater.js";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// User management routes
router.get("/:userId", getUser);
router.put("/:userId", authenticate, putUser);
router.delete("/:userId", authenticate, deleteUser);
router.post("/:userId/profile-image", authenticate, uploadProfileImageEndpoint);
router.delete(
    "/:userId/profile-image",
    authenticate,
    deleteProfileImageEndpoint
);

// Social routes
router.get("/:userId/followers", getFollowers);
router.post("/:userId/follow", authenticate, follow);
router.post("/:userId/unfollow", authenticate, unfollow);

// Moderation routes
router.get("/:userId/reports", authenticate, getReports);
router.post("/:userId/report", authenticate, report);

// Block routes
router.get("/:userId/blocks", authenticate, getBlocks);
router.post("/:userId/block", authenticate, block);
router.post("/:userId/unblock", authenticate, unblock);

export default router;
