import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "Please enter all fields" });

    if (await User.findOne({ email }))
      return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, passwordHash: hashed });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "8h" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "8h" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
