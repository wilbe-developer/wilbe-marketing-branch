
import React, { useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

const SprintWaitingPage = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1F2C] mb-4">
              Thank You for Signing Up!
            </h1>
            <p className="text-xl text-[#403E43] mb-4">
              Your BSF Sprint profile has been saved successfully.
            </p>
            <p className="text-[#403E43]">
              We're preparing to launch the full BSF experience soon. We'll notify you at{" "}
              <span className="font-semibold">{user?.email}</span> when it's ready.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">What happens next?</h2>
            <p className="text-blue-700">
              Our team is putting the finishing touches on the BSF Sprint experience. 
              You'll receive an email when the platform is open, and you'll be able to 
              access your dashboard with all your saved information.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-600">
        Putting Scientists First since 2020.
      </footer>
    </div>
  );
};

export default SprintWaitingPage;
