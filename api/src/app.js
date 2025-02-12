import express from "express";
import userRouter from "./router/userRouter.js";
import authRouter from "./router/authRouter.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: 104857600 }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
    res.send("TRPG BACKEND SAMPLE");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
