"use client";
import { useEffect, useState } from "react";
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
    
    
  }, []);

  return (
    <>
      <Ticket />
      <ToastContainer />
    </>
  );
};

export default Page;
