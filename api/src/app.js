import express from "express";
import userRouter from "./router/userRouter.js";
import authRouter from "./router/authRouter.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: 104857600 }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "O, Authorization, Accept, Content-Type, Origin, X-Access-Token, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
    res.send("TRPG BACKEND SAMPLE");
});

app.listen(1337, () => {
    console.log("Server is running on port 5000");
});
