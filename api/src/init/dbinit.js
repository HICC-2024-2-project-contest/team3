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

// MySQL init
const mysqlInit = path.resolve(__dirname, "./database/mysqlinit.sql");
const sql = fs.readFileSync(mysqlInit, "utf8");
mysqlPool.query(sql.replaceAll("\r\n", ""));
