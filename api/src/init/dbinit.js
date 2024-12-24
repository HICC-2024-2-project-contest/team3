const mysql = require("mysql");
const fs = require("fs");
const { mysqlConfig } = require("../config/database");
const connection = mysql.createConnection(mysqlConfig);

// MySQL init
const mysqlInit = "../database/mysqlinit.sql";
const mysql = fs.readFileSync(filePath, 'utf8');
const result = await connection.query(mysql);
await connection.end();