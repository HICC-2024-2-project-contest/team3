const express = require("express");
const userRoutes = require("./router/userRouter");
const authRoutes = require("./router/authRouter");

const app = express();

app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("TRPG BACKEND SAMPLE");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
})