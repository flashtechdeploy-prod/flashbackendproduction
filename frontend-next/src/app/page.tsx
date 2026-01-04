"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.replace("/dashboard");
      } else {
        // User is not authenticated, redirect to login
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh" 
    }}>
      <div>Loading...</div>
    </div>
  );
}
