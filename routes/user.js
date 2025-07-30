import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = "your_secret_key"; 

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Registering new user with:");
console.log("  Email:", email);
console.log("  Plain Password:", password);
console.log("  Hashed Password:", hashedPassword);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
  

});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", req.body);

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("User from DB:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password did not match");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    console.log("Login successful!");
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message, err.stack);
    res.status(500).json({ error: "Login failed, please try again" });
  }
  console.log("Login attempt:", req.body);
console.log("Stored password:", user.password);
console.log("Entered password:", password);

});

export default router;
