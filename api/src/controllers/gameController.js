import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2/promise";
import redis from "redis";
import jwt from "jsonwebtoken";
import { mysqlConfig, mongoConfig, redisConfig } from "../config/database.js";

const mysqlPool = mysql.createPool(mysqlConfig);

mongoose
    .connect(mongoConfig.uri, mongoConfig.options)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const redisClient = redis.createClient(redisConfig);
(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis connection error:", error);
    }
})();
