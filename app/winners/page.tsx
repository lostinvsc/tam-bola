"use client"
import { useEffect, useState } from "react";

type Winner = {
  name: string;
  ticket: (number | null)[][];
  drawnNumbers: number[];
  patterns: string[];
  createdAt: string;
};

const WinnersList = () => {
  const [groupedWinners, setGroupedWinners] = useState<Record<string, Winner[]>>({});
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch("/api/get-winners");
        const data = await response.json();

        // Group winners by pattern
        const grouped: Record<string, Winner[]> = {};
        data.winners.forEach((winner: Winner) => {
          winner.patterns.forEach((pattern) => {
            if (!grouped[pattern]) {
              grouped[pattern] = [];
            }
            grouped[pattern].push(winner);
          });
        });
        setGroupedWinners(grouped);
      } catch (error) {
        console.error("Error fetching winners:", error);
      }
    };

    fetchWinners();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Winners</h2>
      {Object.keys(groupedWinners).length === 0 ? (
        <p className="text-gray-600">No winners yet.</p>
      ) : (
        Object.entries(groupedWinners).map(([pattern, winners]) => (
          <div key={pattern} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-semibold text-blue-600">{pattern}</h3>
            <ul className="mt-2">
              {winners.map((winner, index) => (
                <li key={index} className="border-b py-2 flex justify-between items-center">
                  <span className="font-medium text-gray-800">{index + 1}. {winner.name}</span>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => setSelectedWinner(winner)}
                  >
                    View Ticket
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {/* Ticket Popup */}
      {selectedWinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white py-4 px-2 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedWinner(null)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-3">{selectedWinner.name}'s Ticket</h2>
            <div className="grid grid-cols-9 gap-2">
              {selectedWinner.ticket.flat().map((num, idx) => (
                <div
                  key={idx}
                  className={`w-9 h-9 flex justify-center items-center text-lg font-semibold rounded ${
                    num === null
                      ? "bg-gray-300"
                      : selectedWinner.drawnNumbers.includes(num)
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {num ?? ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnersList;
