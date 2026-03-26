    const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/joblens")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
const User = require("./models/User");

// REGISTER API
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Registration failed" });
  }
});
// LOGIN API
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
});