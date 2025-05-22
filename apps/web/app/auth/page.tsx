"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm, SignUpForm } from "@repo/features/auth";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const router = useRouter();
  
  const handleSuccess = () => {
    router.push("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "login" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "signup" ? "border-b-2 border-primary-600 text-primary-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>
        
        {activeTab === "login" ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <SignUpForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
} 