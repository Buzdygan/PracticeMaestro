"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { useAuthStatus } from "@repo/features/auth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };
  
  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Practice Maestro</h1>
          <Button>Sign In</Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <section className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-4xl font-bold mb-6">Master Your Piano Practice</h2>
          <p className="text-xl mb-8">
            Using spaced repetition to help you balance reviewing known pieces
            and learning new ones. Practice smarter, not harder.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              className="bg-primary-700 text-white px-6 py-3 rounded-lg"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Button>
            <Button 
              onClick={handleLearnMore}
              className="border border-primary-700 px-6 py-3 rounded-lg"
            >
              Learn More
            </Button>
          </div>
        </section>

        <section id="features" className="grid md:grid-cols-3 gap-8 py-12">
          <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Spaced Repetition</h3>
            <p>
              Optimize your practice with scientifically proven spaced repetition 
              techniques. Never forget what you've learned.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Daily Practice Plans</h3>
            <p>
              Get personalized daily practice schedules based on your progress
              and goals. Focus on what needs attention.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p>
              Monitor your improvement over time with detailed statistics
              and insights about your practice habits.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 p-6">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Practice Maestro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
