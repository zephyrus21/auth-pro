const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello Bitch</h1>");
});

module.exports = app;
