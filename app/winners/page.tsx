"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
interface Pattern {
    _id: string;
    pattern: string;
    winners: string[];
  }
const WinnersDisplay = () => {
    // State to store patterns data
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch patterns from the backend API
    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                const response = await axios.get("/api/get-winners");
                setPatterns(response.data.patterns);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError("Error fetching data");
                setLoading(false);
            }
        };

        fetchPatterns();
    }, []); // Empty dependency array means this runs once after the component mounts

    // Render loading state or error message
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className=" bg-green-300 w-[100vw] h-[100vh]">
            <nav className="shadow-lg w-full p-4 top-0 bg-green-300">
                <div className="container mx-auto flex flex-wrap justify-center md:justify-between items-center gap-3 ">

                    <Link href="/">
                        <button className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black bg-green-700 text-white">
                            Home
                        </button>
                    </Link>
                    {/* Call Agent Button */}
                    <a href="tel:+919366794921">
                        <button className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black bg-green-700 text-white">
                            Call agent
                        </button>
                    </a>

                    {/* WhatsApp Button */}
                    <a href="https://wa.me/916009936047" target="_blank" rel="noopener noreferrer">
                        <button className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black bg-green-700 text-white">
                            WhatsApp
                        </button>
                    </a>

                </div>
            </nav>
            {patterns.length === 0 ? (
                <div className="flex justify-center items-center text-xl text-gray-600">
                    No winners found.
                </div>
            ) : (
                <div className=" flex flex-col bg-green-200">
                    {patterns.map((patternData) => (
                        <div
                            key={patternData._id}
                            className="bg-green-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 mt-5"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-4">=) {patternData.pattern}</h2>
                            <div className="space-y-2">
                                {patternData.winners.map((name: string, index: number) => (
                                    <p key={index} className="text-gray-600 text-lg pl-6">
                                        <span className="text-sm">{index + 1}- </span>
                                        {name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WinnersDisplay;
