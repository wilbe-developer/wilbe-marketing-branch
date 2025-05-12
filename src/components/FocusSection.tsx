
import React from 'react';
import Section from './Section';

const focusAreas = [
  {
    title: 'Mindset',
    description: 'Transition from academic thinking to entrepreneurial execution with speed. We work with you to craft the narrative of a high-performance science company.'
  },
  {
    title: 'Customers',
    description: 'Learn to identify and engage with your customers early and effectively. We help you frame customer conversations to drive concrete outcomes; LOIs, POCs, and commercial partnerships.'
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
    <Section>
      <h2 className="text-3xl font-bold mb-10">The outcome from BSF</h2>
      <div className="space-y-6">
        {focusAreas.map((area, index) => (
          <div key={index} className="border-b border-zinc-200 pb-6 last:border-b-0">
            <h3 className="text-xl font-bold mb-1">{area.title}</h3>
            <p className="text-zinc-600">{area.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default FocusSection;
