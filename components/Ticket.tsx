"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import StartButton from "./StartGame";
import SaveButton from "./Save";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
const generateTambolaTicket = () => {

    const ticket: (number | null)[][] = Array.from({ length: 3 }, () => Array(9).fill(0));
    const columns: { [key: number]: number[] } = {};

    for (let col = 0; col < 9; col++) {
        const min = col * 10 + 1;
        columns[col] = Array.from({ length: 10 }, (_, i) => min + i);
    }

    for (let row = 0; row < 3; row++) {
        const placedCols = new Set<number>();

        while (placedCols.size < 5) {
            const col = Math.floor(Math.random() * 9);
            if (placedCols.has(col)) continue;

            const availableNumbers = columns[col].filter((num) =>
                ticket.every((r) => !r.includes(num))
            );
            if (availableNumbers.length === 0) continue;

            const num = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
            ticket[row][col] = num;
            placedCols.add(col);
        }
    }

    return ticket;
};

const Ticket = () => {
    const router = useRouter();
    const [tickets, setTickets] = useState<{ name: string; ticket: (number | null)[][] }[]>([]);
    
    useEffect(() => {
        const storedData = localStorage.getItem("tambolaTickets");
        if (storedData) {
            setTickets(JSON.parse(storedData));
        } else {
            generateAndSaveTickets();
        }
    }, [router]);

    const generateAndSaveTickets = () => {
        
        const newTickets = Array.from({ length: 100 }, () => ({
            name: "",
            ticket: generateTambolaTicket(),
        }));

        setTickets(newTickets);
        localStorage.setItem("tambolaTickets", JSON.stringify(newTickets));
    };

    const updateName = (index: number, newName: string) => {
        const updatedTickets = [...tickets];
        updatedTickets[index].name = newName;
        setTickets(updatedTickets);
        localStorage.setItem("tambolaTickets", JSON.stringify(updatedTickets));
    };

    const logout = () => {
        const yes = confirm("Are you sure you want to logout")

        if (yes) {

            localStorage.setItem("adminToken", "");
            router.push("/login");
            toast.success("Logged out successfully", {
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            toast.error("Log out unsuccessful", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="flex flex-col items-center">
            <nav className="shadow-lg w-full mb-16 flex justify-between items-center px-4 py-3 fixed top-0 bg-green-300">
    <div className="w-full flex justify-center items-center gap-4 flex-wrap">
        {/* Navigation Buttons */}
        <Link href="/">
            <button className="px-6 py-2 bg-green-700 text-white font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black">
                Home
            </button>
        </Link>

        <button
            onClick={generateAndSaveTickets}
            className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black bg-green-700 text-white"
        >
            Generate 100 Tickets
        </button>

        <SaveButton />
        <StartButton />
    </div>

    {/* Logout Button */}
    <button
        onClick={logout}
        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition ml-auto"
    >
        Logout
    </button>
</nav>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-52">
                {tickets.map((ticketData, index) => (
                    <div key={index} className="bg-green-200 shadow-lg rounded-lg p-4 border-2 border-white">
                        <h2 className="text-center font-bold mb-2">T-{index + 1}</h2>

                        {ticketData.ticket.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {row.map((num, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className="w-12 h-12 flex items-center justify-center border border-white m-1 rounded-md text-lg font-semibold"
                                        style={{ backgroundColor: num ? "#ffeb3b" : "transparent" }}
                                    >
                                        {num || ""}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={ticketData.name}
                            onChange={(e) => updateName(index, e.target.value)}
                            className="w-full mb-2 p-2 border rounded-lg text-center mt-10"
                        />
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Ticket;
