"use client";
import { useState } from "react";
import { toast } from "react-toastify";
const SaveButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSaveToMongoDB = async () => {
    const yes = confirm("Are you sure, you want to save tickets")
    if (yes) {

      const storedData = localStorage.getItem("tambolaTickets");

      if (!storedData) {
        alert("No tickets found in LocalStorage!");
        return;
      }

      const tickets = JSON.parse(storedData);
      setLoading(true);


      try {
        const response = await fetch("/api/save-tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tickets }),
        });

        const data = await response.json();
        if(!data.message){
          toast.error(data.error, {
            position: "top-right",
            autoClose: 3000,
          });
        }else{
          toast.success(data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
      
        toast.error("Error saving tickets", {
          position: "top-right",
          autoClose: 3000,
        });
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleSaveToMongoDB}
      className="px-6 py-2 bg-green-700 text-white font-semibold rounded-lg hover:scale-[1.07] transition border-2 border-black"
      disabled={loading}
    >
      {loading ? "Saving..." : "Save"}
    </button>
  );
};

export default SaveButton;
