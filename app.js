require("dotenv").config();

const { connect } = require("./config/database");
connect();

const express = require("express");
const User = require("./model/user");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello Bitch</h1>");
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!(email && password && firstName && lastName))
    res.status(400).send("Missing required fields");

  const existingUser = await User.findOne({ email });

  if (existingUser) return res.status(400).send("User already exists");

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: encryptedPassword,
  });
});

module.exports = app;
