
import React from 'react';
import Logo from '@/components/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="container py-12 mt-auto border-t border-white/20">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-xl font-bold">Putting Scientists First since 2020.</p>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Logo 
            className="h-8" 
            style={{
              '--sails-color': 'white',
              '--text-color': 'white',
            } as React.CSSProperties}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
