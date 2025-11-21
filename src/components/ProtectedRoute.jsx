"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/lib/api/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  const checkToken = async() =>{
    try{
        const result = await verifyToken();
        if (!result.data?.success) {
            localStorage.clear();
            window.location.href = "/login";
        }

        return true;
    } catch(error){
        localStorage.clear();
        window.location.href = "/login";
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem('username');
    if (!token || !username) {
      router.replace("/login");
      return;
    } else{
        checkToken();
    }

    setAllowed(true);
  }, []);

  if (!allowed) return null;

  return children;
}
