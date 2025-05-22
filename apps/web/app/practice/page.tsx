"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@repo/features/auth";

export default function PracticePage() {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Practice Session</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No Practice Items</h2>
          <p className="text-gray-600 mb-6">
            You don't have any practice items due today. Add some items to your library to get started.
          </p>
          <button 
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
            onClick={() => router.push("/library")}
          >
            Go to Library
          </button>
        </div>
      </div>
    </div>
  );
} 