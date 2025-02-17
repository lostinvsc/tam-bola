"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"
export default function StartButton() {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [duration, setDuration] = useState(3); 

  const handleStartGame = async () => {
    setLoading(true);
    setShowPopup(false); // Close popup after selecting

    try {
      const data={
        time:duration
      }
      const response = await axios.post(`/api/draw-numbers`, data);
      console.log(response)
      if (response.data.start==false) {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching number:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="px-6 py-2 font-semibold rounded-lg hover:scale-[1.07] transition border-2 bg-green-700 text-white border-black"
        disabled={loading}
      >
        {loading ? "Starting..." : "Start"}
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Select Duration (Prefer above 5s)</h2>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border p-2 rounded-lg"
            >
              {[...Array(8)].map((_, i) => (
                <option key={i} value={i + 3}>
                  {i + 3} seconds
                </option>
              ))}
            </select>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleStartGame}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400"
              >
                Start
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
