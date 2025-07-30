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
        const polls = await Poll.find();
        res.status(200).json({polls});
        console.log("✅ Sending polls:", polls.length);  

    }catch(error){
        console.error(error);
    }
});

router.get("/:id", async (req, res) => {
         try{
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ error: "Poll not found" });
         }
        
         res.status(200).json(poll);
    } catch (error) {
        console.error("Error fetching poll:", error);
        }});

router.post("/:id/vote", async (req, res) => {
    const { userId, optionIndex } = req.body;

    if (optionIndex === undefined || optionIndex < 0) {
        return res.status(400).json({ error: "Invalid option index" });
    }

    try{ 
        const poll = await Poll.findById(req.params.id);
        const user = await User.findById(userId);

        if (!poll) {
            return res.status(404).json({ error: "Poll not found" });
        }

        if(user.votedPolls.includes(poll._id)) {
            return res.status(400).json({ error: "User has already voted in this poll" });
        }

        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ error: "Invalid option index" });
        }

        poll.options[optionIndex].votes += 1;
        await poll.save();

        user.votedPolls.push(poll._id);
        await user.save();

        res.status(200).json({ success: true, message: "Vote cast successfully" });
    } catch (error) {
        console.error("Error casting vote:", error);
        res.status(500).json({ error: "Error casting vote" });
    }
});


export default router;
