
import React from 'react';

const features = [{
  title: 'Mindset',
  topText: 'Scientific training rewards precision and caution - often at the cost of speed.',
  bottomText: 'We help you shift gears: in both science and business, faster, rigorous iteration means more data and faster learning.'
}, {
  title: 'Unique playbook',
  topText: 'There is no one playbook for science companies.',
  bottomText: 'We help you build your own unique playbook and raise capital from tier 1 investors.'
}, {
  title: 'Community',
  topText: 'Building a science company is a challenge of a lifetime.',
  bottomText: 'Our 300+ BSF alumni including 80 scientist founders are here to support you.'
}];

const WhoSection: React.FC = () => {
  return <section className="container my-32">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-24">
        <div className="text-6xl font-black">01 //</div>
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl">
          Building a science company is not about IP, but it is about
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((item, index) => <div key={index} className="border border-white/30 p-10 hover:border-[#7ED957] transition-colors">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-bold">{item.title}</h3>
              
            </div>
            <p className="text-lg mb-6 text-white/70">{item.topText}</p>
            <p className="text-lg border-l-4 border-[#7ED957] pl-4">{item.bottomText}</p>
          </div>)}
      </div>
    </section>;
};

export default WhoSection;
