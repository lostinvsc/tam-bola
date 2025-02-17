import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for the Winner document
interface IWinner extends Document {
  pattern: string;
  winners: string[];
}

// Define the schema for storing patterns and associated names
const WinnersSchema: Schema<IWinner> = new Schema(
  {
    pattern: {
      type: String,  // The pattern name, e.g., 'Full House', 'Top Line', etc.
      required: true,
      unique: true,  // Ensure that each pattern is unique
    },
    winners: {
      type: [String],  // An array to store names of players who won with the pattern
      default: [],  // Default to an empty array
    },
  },
  {
    timestamps: true,  // Optionally add timestamps for creation and update
  }
);

// Fix OverwriteModelError by checking if model already exists
const Winners: Model<IWinner> = mongoose.models.Winners || mongoose.model<IWinner>('Winners', WinnersSchema);

export default Winners;
