import {  NextResponse } from "next/server";
import mongoose from "mongoose";
import TambolaTicket from "@/models/TambolaTicket";

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI as string);
};

export async function GET() {
  try {
    await connectDB();

    // Get last 100 tickets sorted by newest first
    const tickets = await TambolaTicket.find({})
      .limit(100);

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
