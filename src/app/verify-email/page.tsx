"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function VerifyUserPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("Validation in Progress ...");

  useEffect(() => {
    const token = searchParams.get("token");
  

    if (!token) {
      setStatus("❌ Token not found!");
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await fetch("/api/verification-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus(data.message || "❌ Verification failed!");
        } else {
          setStatus("✅ User Verified Successfully! Redirecting...");
          // Redirect after 2 seconds
          setTimeout(() => {
            router.push("/"); // 👈 redirect to home
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        setStatus("⚠️ Something went wrong!");
      }
    };

    verifyUser();
  }, [searchParams, router]);

  return (
    <Box
      height="80vh"
      width="95vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      fontSize={{ xs: "1.5rem", md: "2rem" }}
    >
      {status}
    </Box>
  );
}
