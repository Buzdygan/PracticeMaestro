"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@repo/ui/button";
import { AuthStatus, useAuthStatus } from "@repo/features/auth";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const pathname = usePathname();
  
  // Don't show navbar on auth page
  if (pathname === "/auth") {
    return null;
  }
  
  return (
    <header className="bg-primary-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Practice Maestro
        </Link>
        
        <nav className="flex items-center space-x-4">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`text-sm ${pathname === "/dashboard" ? "font-semibold" : "text-white/80 hover:text-white"}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/library" 
                    className={`text-sm ${pathname === "/library" ? "font-semibold" : "text-white/80 hover:text-white"}`}
                  >
                    Library
                  </Link>
                  <Link 
                    href="/practice" 
                    className={`text-sm ${pathname === "/practice" ? "font-semibold" : "text-white/80 hover:text-white"}`}
                  >
                    Practice
                  </Link>
                  <div className="ml-4 pl-4 border-l border-white/20">
                    <AuthStatus />
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button className="bg-white text-primary-800 px-4 py-2 rounded-md text-sm">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}; 