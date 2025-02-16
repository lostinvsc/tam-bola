import DrawnNumbers from "@/models/DrawnNumber";
import { NextRequest, NextResponse } from "next/server";
import TambolaTicket from "@/models/TambolaTicket";
import WinnerModels from "@/models/WinnerModels";
import mongoose from "mongoose";


// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI as string);
};

// Function to check winning patterns based on numbers drawn so far
const checkWinningPatterns = (ticket: number[][], drawnNumbers: number[]) => {
    const patterns: string[] = [];

    if (ticket[0].every((num) => drawnNumbers.includes(num))) patterns.push("Top Line");
    if (ticket[1].every((num) => drawnNumbers.includes(num))) patterns.push("Center Line");
    if (ticket[2].every((num) => drawnNumbers.includes(num))) patterns.push("Bottom Line");

    let markedCount = ticket.flat().filter((num) => drawnNumbers.includes(num)).length;
    if (markedCount >= 7) patterns.push("Quick Seven");

    if (ticket.flat().every((num) => drawnNumbers.includes(num))) patterns.push("Full House");

    return patterns;
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const {time} = await req.json();
      
        // Generate a shuffled array of numbers from 1 to 90
        const numbers: number[] = Array.from({ length: 90 }, (_, i) => i + 1);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        await DrawnNumbers.deleteMany({});
        const numberSave = await DrawnNumbers.create({ numbers:numbers, createdAt:Date.now() + 5000 , time:time});


        // Fetch all tickets
        const tickets = await TambolaTicket.find();
        if (!tickets.length) return NextResponse.json({ message: "No tickets found" }, { status: 404 });

        // Keep track of winners
        const winners = [];

        for (let i = 0; i < numbers.length; i++) {
            const drawnNumbers = numbers.slice(0, i + 1); // Only consider numbers drawn so far

            for (const ticket of tickets) {
                const winningPatterns = checkWinningPatterns(ticket.ticket, drawnNumbers);

                if (winningPatterns.length > 0) {
                    // Save winners with drawn numbers so far
                    const winnerData = {
                        name: ticket.name,
                        ticket: ticket.ticket,
                        drawnNumbers, // Numbers drawn so far at this point
                        patterns: winningPatterns,
                    };

                    // Prevent duplicate saving (only save if not already recorded)
                    const existingWinner = await WinnerModels.findOne({
                        name: ticket.name,
                        patterns: { $in: winningPatterns },
                    });

                    if (!existingWinner) {
                        await WinnerModels.create(winnerData);
                        winners.push(winnerData);
                    }
                }
            }
        }

        if (numberSave) {
            return NextResponse.json({ message: "Game starting soon",winners }, { status: 200 });
        }

        return NextResponse.json({ message: "Error starting the game" }, { status: 400 });

    } catch (error) {
        console.error("Error fetching drawn numbers:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
