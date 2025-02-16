import dotenv from "dotenv";
dotenv.config();

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import WinnerModels from "@/models/WinnerModels";

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tambola");
};

export async function GET() {
    try {
      await connectDB(); // Ensure DB is connected
      const winners = await WinnerModels.find();
      
      if (!winners.length) {
        return NextResponse.json({ message: "No winners found" }, { status: 404 });
      }
  
      return NextResponse.json({ winners }, { status: 200 });
    } catch (error) {
      console.error("Error fetching winners:", error);
      return NextResponse.json({ message: "Error fetching winners", error }, { status: 500 });
    }
  }
  