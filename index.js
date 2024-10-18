const express = require("express");
const app = express();

app.get("/data", async (req, res) => {
  res.send("data is valid");
});

app.listen(8000, () => {
  console.log("https://localhost:8000/");
});
