"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm, SignUpForm } from "@repo/features/auth";
import { Button } from "@repo/ui/button";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const router = useRouter();
  
  const handleSuccess = () => {
    router.push("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md">
        <div className="flex mb-6">
          <Button
            variant={activeTab === "login" ? "primary" : "ghost"}
            onClick={() => setActiveTab("login")}
            fullWidth
            className="rounded-t-md rounded-b-none border-b-2 border-b-transparent"
          >
            Sign In
          </Button>
          <Button
            variant={activeTab === "signup" ? "primary" : "ghost"}
            onClick={() => setActiveTab("signup")}
            fullWidth
            className="rounded-t-md rounded-b-none border-b-2 border-b-transparent"
          >
            Sign Up
          </Button>
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