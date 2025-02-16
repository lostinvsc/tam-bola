import mongoose, { Schema, Document } from "mongoose";

interface IWinner extends Document {
  name: string;
  ticket: number[][];
  drawnNumbers: number[];
  patterns: string[]; // Changed to an array of strings
  createdAt: Date;
}

const WinnerSchema = new Schema<IWinner>({
  name: { type: String, required: true },
  ticket: { type: [[Number]], required: true },
  drawnNumbers: { type: [Number], required: true },
  patterns: { type: [String], required: true }, // Fixed: now an array of strings
  createdAt: { type: Date, default: Date.now }
});

const WinnerModel = mongoose.models.Winner || mongoose.model<IWinner>("Winner", WinnerSchema);

export default WinnerModel;
