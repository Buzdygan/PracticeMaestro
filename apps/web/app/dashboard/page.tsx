"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@repo/features/auth";
import { DashboardContainer } from "@repo/features/dashboard";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuthStatus();
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-gray-600">Welcome, {user?.email}</div>
        </div>
        
        <DashboardContainer />
      </div>
    </div>
  );
} 