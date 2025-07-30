import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  question: String,
  options: [optionSchema]
});

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
