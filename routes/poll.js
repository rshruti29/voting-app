import express from "express";
import Poll from "../models/Poll.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/create", async (req, res) => {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: "Poll must have a question & option" });
    }

    try {
        const poll = new Poll({
            question,
            options: options.map(option => ({
                text: option,
                votes: 0
            }))
        });
        await poll.save();
        res.status(201).json({ success: true, poll });
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ error: "Error creating poll" });
    }
});
router.get("/all", async (req, res) => {
    try {
        const polls = await Poll.find().populate("createdBy", "username");
        res.status(200).json({polls});
    }catch(error){
        console.error(error);
    }
});
export default router;
