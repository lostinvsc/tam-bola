import mongoose, { Schema, Document } from "mongoose";

export interface IDrawnNumbers extends Document {
  numbers: number[];
  time:number;
  createdAt:Date;

}

const DrawnNumbersSchema = new Schema<IDrawnNumbers>({
  numbers: {
    type: [Number], // Array of numbers
    required: true,
    default: [], // Default empty array
  },
  time:{
    type:Number,
    default:8
  },
  createdAt:{
    type:Date,
    required:true,
    default: () => new Date(Date.now() + 5000), 
  }
});

export default mongoose.models.DrawnNumbers ||
  mongoose.model<IDrawnNumbers>("DrawnNumbers", DrawnNumbersSchema);
