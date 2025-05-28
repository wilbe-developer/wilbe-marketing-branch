
import React from 'react';

interface WilbeLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const WilbeLogo: React.FC<WilbeLogoProps> = ({ className = "h-6", style }) => {
  const sailsColor = style?.['--sails-color' as keyof React.CSSProperties] || 'var(--brand-pink, #FF2C6D)';
  const textColor = style?.['--text-color' as keyof React.CSSProperties] || 'var(--brand-pink, #FF2C6D)';

  return (
    <svg
      className={className}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sails */}
      <path
        d="M8 32L8 12C8 10.8954 8.89543 10 10 10L18 10C19.1046 10 20 10.8954 20 12L20 32"
        fill={sailsColor as string}
      />
      <path
        d="M22 32L22 8C22 6.89543 22.8954 6 24 6L30 6C31.1046 6 32 6.89543 32 8L32 32"
        fill={sailsColor as string}
      />
      
      {/* Base */}
      <rect x="6" y="32" width="28" height="2" fill={sailsColor as string} />
      
      {/* Text "WILBE" - adjusted for smaller size */}
      <g fill={textColor as string}>
        <text
          x="42"
          y="26"
          fontSize="14"
          fontWeight="600"
          fontFamily="Helvetica, Arial, sans-serif"
          letterSpacing="0.05em"
        >
          WILBE
        </text>
      </g>
    </svg>
  );
};

export default WilbeLogo;
