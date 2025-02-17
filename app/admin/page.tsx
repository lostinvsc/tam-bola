"use client";
import { useEffect } from "react";
import Ticket from "@/components/Ticket";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";


const Page = () => {
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem("adminToken");
   
   

      if (!token) {
        router.push("/login");
        return;
      }
    
    
  }, [router]);

  return (
    <div className="bg-green-300">
      <Ticket />
      <ToastContainer />
    </div>
  );
};

export default Page;
