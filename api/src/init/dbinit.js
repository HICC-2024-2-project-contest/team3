import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PW,
    database: process.env.MYSQL_DATABASE,
    port: 3306,
    waitForConnections: true,
    multipleStatements: true,
};

const mysqlPool = mysql.createPool(mysqlConfig);

const initializeDatabase = async () => {
    try {
        const mysqlInit = path.resolve(__dirname, "./database/mysqlinit.sql");
        const sql = fs.readFileSync(mysqlInit, "utf8").trim();

        console.log("Executing MySQL initialization script...");
        const [result] = await mysqlPool.query(sql);
        console.log("MySQL initialization completed successfully:", result);
    } catch (error) {
        console.error("Error initializing MySQL:", error);
    } finally {
        await mysqlPool.end();
    }
};

initializeDatabase();
