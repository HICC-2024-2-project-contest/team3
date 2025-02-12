import "dotenv/config";

const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PW,
    database: process.env.MYSQL_DATABASE,
    port: 3306,
    waitForConnections: true,
};

const redisConfig = {
    url: `redis://:${process.env.REDIS_PW}@redis:6379`,
    legacyMode: false,
};

const mongoConfig = {
    uri: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@mongodb:27017`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};

export { mysqlConfig, redisConfig, mongoConfig };

console.log("mysqlConfig:", mysqlConfig);
console.log("redisConfig:", redisConfig);
console.log("mongoConfig:", mongoConfig);
