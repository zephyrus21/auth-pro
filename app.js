require("dotenv").config();
const express = require("express");
const User = require("./model/user");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello Bitch</h1>");
});

app.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!(email && password && firstName && lastName))
    res.status(400).send("Missing required fields");

  const existingUser = User.findOne({ email });

  if (existingUser) return res.status(400).send("User already exists");

  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });
});

module.exports = app;
