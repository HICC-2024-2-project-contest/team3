import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2/promise";
import redis from "redis";
import jwt from "jsonwebtoken";
import { mysqlConfig, redisConfig } from "../config/database.js";
import sendMail from "../utils/sendEmail.js";

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

export const requestEmailVerification = async (req, res) => {
    const { email } = req.body;
    console.log(req.body);
    console.log(email);
    try {
        const [results] = await mysqlPool.query(
            "SELECT * FROM USER WHERE email = ?",
            [email]
        );
        if (results.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const verifyToken = Math.round(1000000 * Math.random());
        await redisClient.setEx(`verifyToken:${email}`, 300, verifyToken);
        await sendMail({
            toEmail: email,
            subject: "TRPG PLATFORM EMAIL VERIFICATION",
            htmlContent: `<p>Your token: <b>${verifyToken}</b></p>`,
        });

        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const verifyEmail = async (req, res) => {
    const { token, email } = req.body;

    try {
        const verifyToken = await redisClient.get(`verifyToken:${email}`);
        if (verifyToken !== token) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const [results] = await mysqlPool.query(
            "SELECT * FROM USER WHERE email = ?",
            [email]
        );
        if (results.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
        }

        await redisClient.setEx(`isEmailVerified:${email}`, 300, 1);

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
