import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Winners from "@/models/WinnerModels";

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return; 
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tambola");
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB.");
    }
};

export async function GET() {
    try {
        await connectDB(); // Connect to DB
        
        // Fetch patterns from the database
        const patterns = await Winners.find();

        if (!patterns.length) {
            return NextResponse.json({ message: "No patterns found" }, { status: 404 });
        }

        // Return the fetched patterns in the response
        return NextResponse.json({ patterns }, { status: 200 });
    } catch (error) {
        console.error("Error fetching patterns:", error);
        return NextResponse.json({ message: "Error fetching patterns" }, { status: 500 });
    }
}
