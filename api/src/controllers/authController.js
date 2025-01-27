require('dotenv').config();
const express = require("express");
const mysql = require("mysql");
const redis = require("redis");
const jwt = require("jsonwebtoken");
const { mysqlConfig, redisConfig, mongoConfig } = require("../config/database");

const mysqlConnection = mysql.createConnection(mysqlConfig);
const redisClient = redis.createClient(redisConfig);
await redisClient.connect();

exports.requestEmailVerification = async (req, res) => {
    const { email } = req.body;

    try {
        // Verify that email is not exist.
        const [results] = await mysqlConnection.promise().query(
            "SELECT * FROM USER WHERE email = ?",
            [email],
        );
        if (results.length !== 0) {
            return res.status(401).json({ error: "Email already exists" });
        }

        // Verify email.
        const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
        await sendMail({
            email: process.env.EMAIL_USER,
            password: process.env.EMAIL_PASS,
            toEmail: email,
            subject: "TRPG PLATFORM EMAIL VERIFICATION",
            htmlContent: `<p>Click <a href="https://SERVER.com/api/v1/auth/verify-email/${verifyToken}">here</a> to verify your email.</p>`
        });

        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.verifyEmail = async (req, res) => {
    const token = req.params.token;

    try {
        // Verify JWT
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedToken) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const { email } = verifiedToken;
        // Verfiy that account is exist
        const [results] = await mysqlConnection.promise().query(
            "SELECT * FROM USER WHERE email = ?",
            [email],
        );
        if (results.length !== 0) {
            return res.status(401).json({ error: "Email already exists" });
        }

        // Insert email verfication data in redis
        await redisClient.set(`isEmailVerified-${email}`, 1);
        await redisClient.expire(`isEmailVerified-${email}`, 300);

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        if (["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(error.name)) {
            return res.status(401).json({ error: "Token expired" });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};