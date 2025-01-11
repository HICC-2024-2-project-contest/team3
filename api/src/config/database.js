require('dotenv').config();

mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PW,
    database: process.env.MYSQL_DATABASE,
    port: 3306
};

redisConfig = {
    url: `redis://:${process.env.REDIS_PW}@redis:6379`,
    legacyMode: true
};

mongoConfig = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017`

module.exports = { mysqlConfig, redisConfig, mongoConfig };