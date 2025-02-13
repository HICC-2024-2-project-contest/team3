import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";
import redis from "redis";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { uploadProfileImage, deleteProfileImage } from "../utils/image.js";
import { mysqlConfig, redisConfig } from "../config/database.js";
import { escape } from "html-escaper";

const mysqlPool = mysql.createPool(mysqlConfig);

const redisClient = redis.createClient(redisConfig);
(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis connection error:", error);
    }
})();

/* ---------------------------------------------------------------------------
   Public Endpoints
--------------------------------------------------------------------------- */

export const register = async (req, res) => {
    const { email, description, password, username } = req.body;
    try {
        const [results] = await mysqlPool.query(
            "SELECT 1 FROM USER WHERE email = ?",
            [email]
        );
        if (results.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
        }
        const emailVerified = await redisClient.get(`isEmailVerified:${email}`);
        if (!emailVerified) {
            return res
                .status(401)
                .json({ error: "Email is not verified or verify expired." });
        }
        await redisClient.del(`isEmailVerified-${email}`);

        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        await mysqlPool.query(
            "INSERT INTO USER (userId, email, password, username, description) VALUES (?, ?, ?, ?, ?)",
            [
                userId,
                escape(email),
                hashedPassword,
                escape(username),
                escape(description),
            ]
        );

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await mysqlPool.query(
            "SELECT * FROM USER WHERE email = ?",
            [email]
        );
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const userId = user.userId;
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "4h",
        });
        const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        await redisClient.set(
            userId.toString() + "-refreshToken",
            refreshToken,
            {
                EX: 86400,
            }
        );

        return res.status(200).json({ accessToken, refreshToken, userId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const storedRefreshToken = await redisClient.get(
            userId.toString() + "-refreshToken"
        );
        if (storedRefreshToken !== refreshToken) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "4h",
        });
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const userId = decoded.userId;
        await redisClient.del(userId.toString() + "-refreshToken");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [results] = await mysqlPool.query(
            "SELECT * FROM USER WHERE userId = ?",
            [userId]
        );
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user: results[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getFollowers = async (req, res) => {
    const { userId } = req.params;
    try {
        const [results] = await mysqlPool.query(
            "SELECT * FROM FOLLOW WHERE followingId = ? UNION SELECT * FROM FOLLOW WHERE followerId = ?",
            [userId, userId]
        );
        return res.status(200).json({ followers: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/* ---------------------------------------------------------------------------
   Protected Endpoints
--------------------------------------------------------------------------- */

export const getReports = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [results] = await mysqlPool.query(
            "SELECT * FROM REPORT WHERE userId = ?",
            [userId]
        );
        return res.status(200).json({ reports: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getBlocks = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [results] = await mysqlPool.query(
            "SELECT * FROM BLOCK WHERE userId = ?",
            [userId]
        );
        return res.status(200).json({ blocks: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const putUser = async (req, res) => {
    const userId = req.user.userId;
    const { username, description } = req.body;
    try {
        await mysqlPool.query(
            "UPDATE USER SET username = ?, description = ? WHERE userId = ?",
            [escape(username), escape(description), userId]
        );
        return res
            .status(200)
            .json({ message: "User information updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    const userId = req.user.userId;
    try {
        await deleteProfileImage(userId);
        await mysqlPool.query("DELETE FROM USER WHERE userId = ?", [userId]);
        await redisClient.del(userId.toString() + "-refreshToken");
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const uploadProfileImageEndpoint = async (req, res) => {
    const userId = req.user.userId;
    const { image } = req.body;
    try {
        const imageLocation = await uploadProfileImage(userId, image);
        await mysqlPool.query(
            "UPDATE USER SET profileImage = ? WHERE userId = ?",
            [imageLocation, userId]
        );
        return res
            .status(200)
            .json({ message: "Profile image uploaded successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProfileImageEndpoint = async (req, res) => {
    const userId = req.user.userId;
    try {
        await deleteProfileImage(userId);
        await mysqlPool.query(
            "UPDATE USER SET profileImage = NULL WHERE userId = ?",
            [userId]
        );
        return res
            .status(200)
            .json({ message: "Profile image deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const follow = async (req, res) => {
    const userId = req.user.userId;
    const { targetUserId } = req.body;
    try {
        const [targetUser] = await mysqlPool.query(
            "SELECT 1 FROM USER WHERE userId = ?",
            [targetUserId]
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }
        const [existingFollow] = await mysqlPool.query(
            "SELECT 1 FROM FOLLOW WHERE followerId = ? AND followingId = ?",
            [userId, targetUserId]
        );
        if (existingFollow.length > 0) {
            return res.status(409).json({ error: "Already following" });
        }
        await mysqlPool.query(
            "INSERT INTO FOLLOW (followerId, followingId) VALUES (?, ?)",
            [userId, targetUserId]
        );
        return res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const unfollow = async (req, res) => {
    const userId = req.user.userId;
    const { targetUserId } = req.body;
    try {
        const [targetUser] = await mysqlPool.query(
            "SELECT 1 FROM USER WHERE userId = ?",
            [targetUserId]
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }
        const [existingFollow] = await mysqlPool.query(
            "SELECT 1 FROM FOLLOW WHERE followerId = ? AND followingId = ?",
            [userId, targetUserId]
        );
        if (existingFollow.length === 0) {
            return res.status(409).json({ error: "Not following" });
        }
        await mysqlPool.query(
            "DELETE FROM FOLLOW WHERE followerId = ? AND followingId = ?",
            [userId, targetUserId]
        );
        return res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const report = async (req, res) => {
    const userId = req.user.userId;
    const { targetUserId, reason } = req.body;
    try {
        const [targetUser] = await mysqlPool.query(
            "SELECT 1 FROM USER WHERE userId = ?",
            [targetUserId]
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }
        await mysqlPool.query(
            "INSERT INTO REPORT (userId, targetUserId, reason) VALUES (?, ?, ?)",
            [userId, targetUserId, escape(reason)]
        );
        return res.status(200).json({ message: "Reported successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const block = async (req, res) => {
    const userId = req.user.userId;
    const { targetUserId } = req.body;
    try {
        const [targetUser] = await mysqlPool.query(
            "SELECT 1 FROM USER WHERE userId = ?",
            [targetUserId]
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }
        const [existingBlock] = await mysqlPool.query(
            "SELECT 1 FROM BLOCK WHERE userId = ? AND targetUserId = ?",
            [userId, targetUserId]
        );
        if (existingBlock.length > 0) {
            return res.status(409).json({ error: "Already blocking" });
        }
        await mysqlPool.query(
            "INSERT INTO BLOCK (userId, targetUserId) VALUES (?, ?)",
            [userId, targetUserId]
        );
        return res.status(200).json({ message: "Blocked successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const unblock = async (req, res) => {
    const userId = req.user.userId;
    const { targetUserId } = req.body;
    try {
        const [targetUser] = await mysqlPool.query(
            "SELECT 1 FROM USER WHERE userId = ?",
            [targetUserId]
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }
        const [existingBlock] = await mysqlPool.query(
            "SELECT 1 FROM BLOCK WHERE userId = ? AND targetUserId = ?",
            [userId, targetUserId]
        );
        if (existingBlock.length === 0) {
            return res.status(409).json({ error: "Not blocking" });
        }
        await mysqlPool.query(
            "DELETE FROM BLOCK WHERE userId = ? AND targetUserId = ?",
            [userId, targetUserId]
        );
        return res.status(200).json({ message: "Unblocked successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
