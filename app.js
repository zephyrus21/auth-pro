require("dotenv").config();

const { connect } = require("./config/database");
connect();

const express = require("express");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const User = require("./model/user");
const auth = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>Hello Bitch</h1>");
});

app.post("/register", async (req, res) => {
  try {
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

    const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "4h",
    });

    user.token = token;

    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) res.status(400).send("Missing required fields");

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return res.status(400).send("User doesn't exist");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).send("Incorrect password");

    const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "4h",
    });

    user.token = token;

    user.password = undefined;

    // res.status(200).json(user);

    const options = {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/user", auth, (req, res) => {
  res.send("Hello User");
});

module.exports = app;
