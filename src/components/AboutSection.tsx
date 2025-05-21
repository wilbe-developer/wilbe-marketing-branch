
import React from 'react';

const stats = [{
  value: "$2.5M",
  label: "Average pre-seed raised size",
  sublabel: "in first year"
}, {
  value: "4 months",
  label: "Average time to close",
  sublabel: "pre-seed"
}, {
  value: "2.5%",
  label: "Average equity",
  sublabel: "transferred to TTO"
}];

const AboutSection: React.FC = () => {
  return <section className="container my-32">
      <div className="border border-white/30 p-14 relative">
        <div className="absolute top-0 left-0 -translate-y-1/2 bg-black px-6">
          <h2 className="text-4xl font-bold">About Wilbe</h2>
        </div>

        <p className="text-xl mb-10 max-w-4xl">Since 2020, we've been equipping scientists with the tools to build ventures that matter – through business know-how, community, capital, and lab space.</p>
        <p className="text-xl mb-10 max-w-4xl">Today, our portfolio spans 20 investments with a combined valuation of $650M, and we're proud to support the world's largest network of entrepreneurial scientists – across academia, startups, and industry.</p>
        <p className="text-xl font-bold">
          Curious? Learn more at <a href="https://wilbe.com" target="_blank" rel="noopener noreferrer" className="text-[#7ED957]">wilbe.com</a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14 border-t border-white/30 pt-14">
          {stats.map((stat, index) => <div key={index}>
              <p className="text-5xl font-black mb-3">{stat.value}</p>
              <p className="text-lg text-white/70">{stat.label} {stat.sublabel}</p>
            </div>)}
        </div>
      </div>
    </section>;
};

export default AboutSection;
