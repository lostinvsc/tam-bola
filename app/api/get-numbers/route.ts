import DrawnNumbers from "@/models/DrawnNumber";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI as string);
};

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Fetch the latest drawn numbers (most recent entry)
        const latestDrawnNumbers = await DrawnNumbers.find();

        // if (!latestDrawnNumbers.length) {
        //     return NextResponse.json({ message: "No drawn numbers found." }, { status: 404 });
        // }


        return NextResponse.json({ message: "Game starting", numbers: latestDrawnNumbers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching drawn numbers:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
