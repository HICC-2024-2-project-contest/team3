const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("TRPG BACKEND SAMPLE");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
})