require('dotenv').config();
const express = require("express");
const mysql = require("mysql");
const redis = require("redis");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {v4: uuidv4} = require("uuid");
const { uploadProfileImage, deleteProfileImage } = require("../utils/image");
const { mysqlConfig, redisConfig, mongoConfig } = require("../config/database");

const mysqlConnection = mysql.createConnection(mysqlConfig);
const redisClient = redis.createClient(redisConfig);
await redisClient.connect();

exports.register = async (req, res) => {
    const { email, description, password, username } = req.body;
    
    try {
        // Verify that email is not duplicated.
        const [results] = await mysqlConnection.promise().query(
            "SELECT 1 FROM USER WHERE email = ?",
            [email],
        );
        if (results.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
        }

        // Check email is verified
        const emailVerified = await redisClient.get(`isEmailVerified-${email}`);
        if (!emailVerified) {
            return res.status(401).json({ error: "Email is not verified or verify expired." });
        }
        await redisClient.del(`isEmailVerified-${email}`)

        // Insert account data  
        const userId = uuidv4();
        const hashedPassword = bcrypt.hash(password, 10);
        await mysqlConnection.promise().query(
            "INSERT INTO USER (userId, email, password, username, description) VALUES (?, ?, ?, ?, ?)",
            [userId, email, hashedPassword, username, description],
        );

        return res.status(200).json({ message: "Verification email sent." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verify that email exists.
        const [results] = await mysqlConnection.promise().query(
            "SELECT * FROM USER WHERE email = ?",
            [email],
        );
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Verify password.
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate Tokens
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "4h" });
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Insert refresh Token in redis
        await redisClient.set(user.id.toString() + "-refreshToken", refreshToken);
        await redisClient.expire(user.id.toString() + "-refreshToken", 86400);

        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Verify refresh token in redis
        const storedRefreshToken = await redisClient.get(userId.toString() + "-refreshToken");
        if (storedRefreshToken !== refreshToken) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // Generate new access token
        const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: "4h" });

        return res.status(200).json({ accessToken: accessToken });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Check refresh token
        const decoded = jwt.decode(refreshToken, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Delete refresh token in redis
        await redisClient.del(userId.toString() + "-refreshToken");

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.getUser = async (req, res) => {
    const userId = req.params.userId
    try {
        // Get user information
        const [results] = await mysqlConnection.promise().query(
            "SELECT * FROM USER WHERE id = ?",
            [userId],
        );
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid user" });
        }

        return res.status(200).json({ user: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.getFollowers = async (req, res) => {
    const userId = req.params.userId;
    try {
        // Get followers
        const [results] = await mysqlConnection.promise().query(
            "SELECT * FROM FOLLOW WHERE userId = ?",
            [userId],
        );
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid user" });
        }

        return res.status(200).json({ followers: results });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
};

exports.getReports = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        // Get reports
        const [results] = await mysqlConnection.promise().query(
            "SELECT * FROM REPORT WHERE userId = ?",
            [userId],
        );
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid user" });
        }

        return res.status(200).json({ reports: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.getBlocks = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        // Get blocks
        const [results] = await mysqlConnection.promise().query(
            "SELECT * FROM BLOCK WHERE userId = ?",
            [userId],
        );
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid user" });
        }

        return res.status(200).json({ blocks: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.putUser = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, description } = req.body;

    try {
        // Update user information
        await mysqlConnection.promise().query(
            "UPDATE USER SET username = ?, description = ? WHERE userId = ?",
            [username, description, userId],
        );

        return res.status(200).json({ message: "User information updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        // Delete user
        await mysqlConnection.promise().query(
            "DELETE FROM USER WHERE id = ?",
            [userId],
        );
        await redisClient.del(userId.toString() + "-refreshToken");
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.uploadProfileImage = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { image } = req.body;
        await uploadProfileImage(userId, image);
        await mysqlConnection.promise().query(
            "UPDATE USER SET profileImage = ? WHERE userId = ?",
            [image, userId],
        );

        return res.status(200).json({ message: "Profile image uploaded successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteProfileImage = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        await deleteProfileImage(userId);
        await mysqlConnection.promise().query(
            "UPDATE USER SET profileImage = NULL WHERE userId = ?",
            [userId],
        );
        return res.status(200).json({ message: "Profile image deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.follow = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { targetUserId } = req.body;

    try {
        // Check if the target user exists
        const [targetUser] = await mysqlConnection.promise().query(
            "SELECT 1 FROM USER WHERE id = ?",
            [targetUserId],
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }

        // Check if the user is already following the target user
        const [existingFollow] = await mysqlConnection.promise().query(
            "SELECT 1 FROM FOLLOW WHERE followerId = ? AND followingId = ?",
            [userId, targetUserId],
        );
        if (existingFollow.length > 0) {
            return res.status(409).json({ error: "Already following" });
        }

        // Follow
        await mysqlConnection.promise().query(
            "INSERT INTO FOLLOW (followerId, followingId) VALUES (?, ?)",
            [userId, targetUserId],
        );

        return res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.unfollow = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { targetUserId } = req.body;

    try {
        // Check if the target user exists
        const [targetUser] = await mysqlConnection.promise().query(
            "SELECT 1 FROM USER WHERE id = ?",
            [targetUserId],
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }

        // Check if the user is following the target user
        const [existingFollow] = await mysqlConnection.promise().query(
            "SELECT 1 FROM FOLLOW WHERE followerId = ? AND followingId = ?",
            [userId, targetUserId],
        );
        if (existingFollow.length === 0) {
            return res.status(409).json({ error: "Not following" });
        }

        // Unfollow
        await mysqlConnection.promise().query(
            "DELETE FROM FOLLOW WHERE followerId = ? AND followingId = ?",
            [userId, targetUserId],
        );

        return res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.report = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { targetUserId, reason } = req.body;

    try {
        // Check if the target user exists
        const [targetUser] = await mysqlConnection.promise().query(
            "SELECT 1 FROM USER WHERE id = ?",
            [targetUserId],
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }

        // Report
        await mysqlConnection.promise().query(
            "INSERT INTO REPORT (userId, targetUserId, reason) VALUES (?, ?, ?)",
            [userId, targetUserId, reason],
        );

        return res.status(200).json({ message: "Reported successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.block = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { targetUserId } = req.body;

    try {
        // Check if the target user exists
        const [targetUser] = await mysqlConnection.promise().query(
            "SELECT 1 FROM USER WHERE id = ?",
            [targetUserId],
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }

        // Check if the user is already blocking the target user
        const [existingBlock] = await mysqlConnection.promise().query(
            "SELECT 1 FROM BLOCK WHERE userId = ? AND targetUserId = ?",
            [userId, targetUserId],
        );
        if (existingBlock.length > 0) {
            return res.status(409).json({ error: "Already blocking" });
        }

        // Block
        await mysqlConnection.promise().query(
            "INSERT INTO BLOCK (userId, targetUserId) VALUES (?, ?)",
            [userId, targetUserId],
        );

        return res.status(200).json({ message: "Blocked successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.unblock = async (req, res) => {
    const userId = req.params.userId;
    const accessToken = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    if (accessToken.userId !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { targetUserId } = req.body;

    try {
        // Check if the target user exists
        const [targetUser] = await mysqlConnection.promise().query(
            "SELECT 1 FROM USER WHERE id = ?",
            [targetUserId],
        );
        if (targetUser.length === 0) {
            return res.status(404).json({ error: "Target user not found" });
        }

        // Check if the user is blocking the target user
        const [existingBlock] = await mysqlConnection.promise().query(
            "SELECT 1 FROM BLOCK WHERE userId = ? AND targetUserId = ?",
            [userId, targetUserId],
        );
        if (existingBlock.length === 0) {
            return res.status(409).json({ error: "Not blocking" });
        }

        // Unblock
        await mysqlConnection.promise().query(
            "DELETE FROM BLOCK WHERE userId = ? AND targetUserId = ?",
            [userId, targetUserId],
        );

        return res.status(200).json({ message: "Unblocked successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};