import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import TambolaTicket from "@/models/TambolaTicket";

// Define the Ticket type
interface Ticket {
  name: string;
  ticket: number[][];
}

// Connect to MongoDB (Ensure this runs once)
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI as string);
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Destructure tickets from the request body and type it
    const { tickets }: { tickets: Ticket[] } = await req.json();

    if (!tickets || tickets.length === 0) {
      return NextResponse.json({ error: "No tickets provided" }, { status: 400 });
    }

    // Filter out tickets without a name
    const validTickets = tickets.filter(ticket => ticket.name && ticket.name.trim() !== "");

    if (validTickets.length === 0) {
      return NextResponse.json({ error: "At least one ticket must have a name" }, { status: 400 });
    }

    // Delete older tickets beyond the latest 100
    await TambolaTicket.deleteMany({});

    // Insert only valid tickets
    await TambolaTicket.insertMany(validTickets);

    return NextResponse.json({ message: "Tickets Saved Successfully!" });
  } catch (error) {
    console.error("Error Saving tickets:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
