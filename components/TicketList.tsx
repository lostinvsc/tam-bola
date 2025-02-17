"use client";
import { useEffect, useState } from "react";
import axios from "axios"
import moment from "moment";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
interface Ticket {
  _id: string;
  name: string;
  ticket: number[][];
}

const TicketsList = () => {
  const router = useRouter();  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [timei, settimei] = useState(8);

  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<moment.Moment | null>(null);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [statec, setstatec] = useState(false);
  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const response = await axios.get("/api/get-numbers");
        console.log(response)
        const latestDraw = response.data.numbers[0]; // Get the latest drawn numbers

        if (latestDraw) {
          setNumbers(latestDraw.numbers);
          setStartTime(moment(latestDraw.createdAt));
          settimei(latestDraw.time);
        }
      } catch (error) {
        console.error("Error fetching drawn numbers:", error);
      }
    };


    fetchNumbers();

  }, [statec]);

  const [second, setsecond] = useState(0)
  useEffect(() => {
    if (!startTime || numbers.length === 0) return;

    const interval = setInterval(() => {
      const elapsedSeconds = moment().diff(startTime, "seconds");
      const index = Math.floor(elapsedSeconds / timei);

      if (index < numbers.length) {
        setCurrentIndex(index);
      } else if (!gameFinished) {
        setCurrentIndex(89);
        setGameFinished(true);

        if (moment().diff(startTime, "seconds") <= (timei * 90 + 120)) {

          toast.success("Game Finished! All numbers have been drawn.", {
            position: "top-right",
            autoClose: 3000,
          });


if(second==0){
  setsecond(1);
  router.push("/winners")
}
          setTickets([])
          setNumbers([])
        }

      }
    }, 5000); // Check every 5 second

    return () => clearInterval(interval);
  }, [startTime, numbers, gameFinished]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("/api/get-tickets");
        const data = response.data;
        // console.log(data.tickets)
        setTickets(data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {

        const intervalId = setInterval(() => {
          setLoading(false);
          clearInterval(intervalId);
        }, 3000);

      }
    };

    fetchTickets();
  }, [statec]);


  useEffect(() => {
    if (!startTime) return;

    const checkAndRefresh = () => {
      const elapsedSeconds = moment().diff(startTime, "seconds");

      if (elapsedSeconds > timei * 90 + 120) {
        setGameFinished(false);
        const fetchNewGameData = async () => {
          try {
            setstatec(!statec)
          } catch (error) {
            console.error("Error resetting game data:", error);
          }
        };

        fetchNewGameData();
      }
    };


    const interval = setInterval(checkAndRefresh, timei * 1000);

    return () => clearInterval(interval);
  }, [startTime]);


  if (loading) return <p className="text-center text-xl font-bold">Loading...</p>;

  return (
    <div className=" mx-auto w-full min-h-screen pb-9">


      <Navbar />


      {
        moment().diff(startTime, "seconds") > timei * 90 + 120 ?



          <h1 className="mx-auto w-fit text-xl font-bold mt-28">
            Wait for new game to begin. . .
          </h1>
          :
          <div className="flex flex-col items-center justify-center mb-8 mt-14">
            <h1 className="text-3xl font-bold mb-4">
              {
                gameFinished ? "Game Finished"
                  :
                  "Drawn Number"
              }

            </h1>


            {numbers.length > 0 ? (
              <div className="text-5xl font-bold bg-gray-200 p-6 rounded-lg shadow-lg">
                {currentIndex < numbers.length ? numbers[currentIndex] : "Waiting..."}
              </div>
            ) : (
              <p className="text-xl">Game not started yet</p>
            )}

            <div className="overflow-scroll w-full p-5">
              {
                numbers.map((v, i) => {
                  if (i <= currentIndex) {

                    return (
                      <span key={i} className="mr-5">
                        {v}
                      </span>
                    )
                  }
                })
              }

            </div>
          </div>

      }

      {
        moment().diff(startTime, "seconds") <= (timei) * 90 + 120 &&


        <div className="flex flex-wrap w-full gap-6 pt-5 justify-center">
          {tickets.length > 0 && (
            tickets.map((ticketData, index) => (
              <div key={index} className="bg-green-200 shadow-lg rounded-lg p-4 border-2 border-white max-w-[95vw]">
                <h2 className="text-center font-bold mb-2">T-{index + 1}</h2>

                {ticketData.ticket.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((num, colIndex) => {
                      // Check if the number is in the drawn list
                      const isDrawn = numbers.slice(0, currentIndex + 1).includes(num);

                      return (
                        <div
                          key={colIndex}
                          className="w-12 h-12 flex items-center justify-center border border-white m-1 rounded-md text-lg font-semibold"
                          style={{
                            backgroundColor: isDrawn ? "#ff0000" : "#ffeb3b",
                            color: isDrawn ? "#ffffff" : "#000000",
                          }}
                        >
                          {num || ""}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div className="w-full mb-2 p-2 border border-white rounded-lg text-center mt-10">
                  {ticketData.name ? ticketData.name : "No name"}
                </div>
              </div>
            ))
          )
          }
        </div>
      }

      {
        tickets.length == 0 &&
        <p className="font-bold w-fit mx-auto text-xl"> No New Tickets Generated Yet </p>
      }


    </div>
  );
};

export default TicketsList;