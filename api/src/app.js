const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use()

app.get("/", (req, res) => {
  res.send("TRPG BACKEND SAMPLE");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
})