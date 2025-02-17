import DrawnNumbers from "@/models/DrawnNumber";
import { NextRequest, NextResponse } from "next/server";
import TambolaTicket from "@/models/TambolaTicket";
import Winners from "@/models/WinnerModels";
import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI as string);
};


interface TicketHolder {
    name: string;
    ticket: number[][];
}

interface WinnerResult {
    pattern: string;
    winners: string[];
  }

  type WinnerArray = WinnerResult[];


const checkTambolaWinners = (ticketHolders: TicketHolder[], drawnNumbers: number[]) => {
    const drawnSet = new Set(drawnNumbers);
    const results: { pattern: string; winners: string[] }[] = [];

    const patterns = {
        "Top Line": (ticket: number[][]) => ticket[0].every(num => drawnSet.has(num)),
        "Centre Line": (ticket: number[][]) => ticket[1].every(num => drawnSet.has(num)),
        "Bottom Line": (ticket: number[][]) => ticket[2].every(num => drawnSet.has(num)),
        "Quick Seven": (ticket: number[][]) => ticket.flat().filter(num => drawnSet.has(num)).length >= 19,
        "Full House": (ticket: number[][]) => ticket.flat().every(num => drawnSet.has(num)),
        //   "Second Full House": (ticket: number[][]) => ticket.flat().every(num => drawnSet.has(num)) // Same as Full House
    };

    for (const [pattern, checkFn] of Object.entries(patterns)) {
        const winners = ticketHolders.filter(({ ticket }) => checkFn(ticket)).map(({ name }) => name);
        if (winners.length) results.push({ pattern, winners });
    }

    return results;
};



export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { time } = await req.json();

        // Shuffle numbers from 1 to 90
        const numbers: number[] = Array.from({ length: 90 }, (_, i) => i + 1);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        await DrawnNumbers.deleteMany({});
        await Winners.deleteMany({});
        await DrawnNumbers.create({ numbers, createdAt: Date.now() + 5000, time });
        const tickets = await TambolaTicket.find({}).lean();

        const formattedTickets = tickets.map(t => ({
            name: t.name,
            ticket: t.ticket
        }));




        const ff: WinnerArray = [];


        for (let i = 4; i <= 90; i++) {
            const drawnNumbers = numbers.slice(0, i);

            drawnNumbers.push(0);

            const result = checkTambolaWinners(formattedTickets, drawnNumbers);

            //    console.log(result);


            if (result && result[0] && result[0].pattern) {
                for (let k = 0; k < result.length; k++) {
                    ff.push(result[k])
                }
            }

        }
        const finalArray: WinnerArray = [];
        let qs = false;
        let tl = false;
        let cl = false;
        let bl = false;
        let fh = false;

        for (let k = 0; k < ff.length; k++) {
            if (ff[k].pattern == "Quick Seven" && !qs) {
                qs = true;
                finalArray.push(ff[k]);
            }
            if (ff[k].pattern == "Top Line" && !tl) {
                tl = true;
                finalArray.push(ff[k]);
            }
            if (ff[k].pattern == "Centre Line" && !cl) {
                cl = true;
                finalArray.push(ff[k]);
            }
            if (ff[k].pattern == "Bottom Line" && !bl) {
                bl = true;
                finalArray.push(ff[k]);
            }
            if (ff[k].pattern == "Full House" && !fh) {
                fh = true;
                finalArray.push(ff[k]);
            }

        }

        

          await Winners.insertMany(finalArray);


        return NextResponse.json({ message: "Game started" }, { status: 200 });

    } catch (error) {
        console.error("Error processing game start:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
