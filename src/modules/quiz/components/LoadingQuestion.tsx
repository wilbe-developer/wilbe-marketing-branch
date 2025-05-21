
import React from 'react';

interface LoadingQuestionProps {
  logoSrc?: string;
}

const LoadingQuestion: React.FC<LoadingQuestionProps> = ({ 
  logoSrc = "/lovable-uploads/e1312da7-f5eb-469d-953a-a520bd9538b9.png" 
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 bg-white border-2 border-[#ff0052] early-internet-card">
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-[#ffccd5] rounded w-3/4 mx-auto"></div>
        
        <div className="space-y-2 mt-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-[#ffccd5] rounded w-full"></div>
          ))}
        </div>
        
        <div className="text-center text-gray-400 font-['Comic_Sans_MS'] text-xs mt-2">
          Loading survey... <img src={logoSrc} alt="Logo" className="inline-block h-3 ml-1" />
        </div>
      </div>
    </div>
  );
};

export default LoadingQuestion;
