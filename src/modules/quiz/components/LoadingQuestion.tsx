
import React from 'react';
import WilbeLogo from "@/assets/WilbeLogo";

interface LoadingQuestionProps {
  message?: string;
}

const LoadingQuestion: React.FC<LoadingQuestionProps> = ({ 
  message = "Loading next question..." 
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white px-4 py-6 rounded-sm pixel-border early-internet-card">
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#ff0052] border-r-[#ff6b8b] border-b-[#ff0052] border-l-[#ff6b8b] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-lg font-['Comic_Sans_MS'] text-[#333]">{message}</p>
        </div>
        
        {/* Logo */}
        <div className="text-center mt-4">
          <WilbeLogo
            className="h-6 mx-auto"
            style={{
              '--sails-color': 'var(--brand-pink, #FF2C6D)',
              '--text-color': 'var(--brand-darkBlue, #0A1632)',
            } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingQuestion;
