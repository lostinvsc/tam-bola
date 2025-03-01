import TicketsList from "@/components/TicketList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-green-300">
      <TicketsList />
      <ToastContainer />
    </main>
  );
}

