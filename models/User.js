import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    votedPolls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll"
    }],
});

export default mongoose.model("User", userSchema);
