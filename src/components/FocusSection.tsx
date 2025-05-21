
import React from 'react';

const focusAreas = [
  {
    title: 'Mindset',
    description: 'Transition from academic thinking to entrepreneurial execution with speed. We work with you to craft the narrative of a high-performance science company.'
  },
  {
    title: 'Customers',
    description: 'Learn to identify and engage with your customers early and effectively. We help you frame customer conversations to drive concrete outcomes: LOIs, POCs, and commercial partnerships.'
  },
  {
    title: 'Operations',
    description: 'Lay the foundations for scale—from day zero. From a sound cap table, IP strategy, globally sourced first hires to vibrant lab space—we set you up for growth.'
  },
  {
    title: 'Fundraising',
    description: 'Navigate your fundraise with confidence. If we invest, we work with you to identify the right investors and secure the capital to advance your mission.'
  }
];

const FocusSection: React.FC = () => {
  return (
    <section className="container my-32">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-24">
        <div className="text-6xl font-black">04 //</div>
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl">The outcome from BSF</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/30">
        {focusAreas.map((area, index) => (
          <div key={index} className="bg-black p-10">
            <div className="flex items-center mb-8">
              <div className="h-10 w-1 bg-[#7ED957] mr-4"></div>
              <h3 className="text-3xl font-bold">{area.title}</h3>
            </div>
            <p className="text-lg text-white/70">{area.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FocusSection;
