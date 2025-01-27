const mysql = require("mysql");
const fs = require("fs");
const { mysqlConfig } = require("../config/database");
const connection = mysql.createConnection(mysqlConfig);

// MySQL init
const mysqlInit = "../database/mysqlinit.sql";
const mysql = fs.readFileSync(mysqlInit, 'utf8');
await connection.query(mysql);
await connection.end();