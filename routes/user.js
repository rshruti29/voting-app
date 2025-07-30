import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // In production, use environment variable

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "Username or email already exists" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username 
            }, 
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.status(201).json({ 
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: "Registration failed", 
            error: error.message 
        });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email   
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid email or password" 
            });
        }
        // Generate JWT
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username 
            }, 
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Send response
        res.json({
            token,
            userId: user._id,
            username: user.username,
            email: user.email,
            success: true, 
            message: "Login successful"
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: "Login failed", 
            error: error.message 
        });
    }
});
export default router;
