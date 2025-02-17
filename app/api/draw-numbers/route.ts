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
  
  interface WinningResult {
    pattern: string;
    winners: string[];
  }
  

  const checkTambolaWinners = (ticketHolders: TicketHolder[], drawnNumbers: number[]) => {
    const drawnSet = new Set(drawnNumbers);
    const results: { pattern: string; winners: string[] }[] = [];
  
    const patterns = {
      "Top Line": (ticket: number[][]) => ticket[0].every(num => drawnSet.has(num)),
      "Centre Line": (ticket: number[][]) => ticket[1].every(num => drawnSet.has(num)),
      "Bottom Line": (ticket: number[][]) => ticket[2].every(num => drawnSet.has(num)),
      "Quick Seven": (ticket: number[][]) => ticket.flat().filter(num => drawnSet.has(num)).length >= 7,
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

        

        interface PatternData {
            pattern: string;  
            name: string[];  
          }
          
          let finalArray: PatternData[] = [];
          
          function addToFinalArray(pattern: string, names: string[]): void {
            const exists = finalArray.find(item => item.pattern === pattern);
          
            if (!exists) {
              finalArray.push({ pattern, name: names });
              // console.log("Added successfully:", { pattern, name: names });
            } else {
              // console.log(`Pattern "${pattern}" already exists!`);
            }
          }

  
        await DrawnNumbers.deleteMany({});
        await Winners.deleteMany({});
        await DrawnNumbers.create({ numbers, createdAt: Date.now() + 5000, time });
        const tickets = await TambolaTicket.find({}).lean(); 

        const formattedTickets = tickets.map(t => ({
            name: t.name,
            ticket: t.ticket 
        }));

        // let drawnNumbers: number[] = [];
        // let currentIndex = 0;
// console.log(formattedTickets)

        for (let i = 4; i <= 90; i++) {
           const drawnNumbers=numbers.slice(0,i);
           let result = checkTambolaWinners(formattedTickets, drawnNumbers);
        //    console.log(result);
           if (result && result[0] && result[0].pattern) {
            addToFinalArray(result[0].pattern,result[0].winners)
        } 
          
        }

        console.log(finalArray)

          await Winners.create(finalArray);
        

// const ticketHolders = [
//     { name: "Alice", ticket: [[5, 18, 30,90,89], [11, 22, 35,87,86], [14, 25, 40,54,53]] },
//     { name: "Bob", ticket: [[1, 2, 3,10,11], [4, 5, 6,12,13], [7, 8, 9,14,15]] },
//   ];
  
//   const drawnNumbers = [5, 18, 30,90,89,4,5,6,8,11,12,13,22,35]; 
  
//   console.log(checkTambolaWinners(ticketHolders, drawnNumbers));


        return NextResponse.json({ message: "Game started" }, { status: 200 });

    } catch (error) {
        console.error("Error processing game start:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
