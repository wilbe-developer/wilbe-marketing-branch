
import React from 'react';

const scientists = [
  {
    name: "Kärt Tomberg",
    title: "Co-founder & CEO, ExpressionEdits",
    image: "" // We'll use a placeholder and styling instead of actual images
  },
  {
    name: "Francesco Sciortino",
    title: "Co-founder & CEO, Proxima Fusion",
    image: ""
  },
  {
    name: "Assia Kasdi",
    title: "Co-founder & CEO, Milvus Advanced",
    image: ""
  }
];

const ScientistsGallery: React.FC = () => {
  return (
    <section className="container mb-24">
      <div className="flex flex-col md:flex-row gap-4 items-start mb-16">
        <div className="text-6xl font-black">03 //</div>
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl">The scientists who became founders with us</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/30">
        {scientists.map((scientist, index) => (
          <div key={index} className="bg-black p-8">
            <div className="w-24 h-24 border border-white/30 rounded-full mb-6"></div>
            <h3 className="text-2xl font-bold">{scientist.name}</h3>
            <p className="text-lg text-[#7ED957]">{scientist.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScientistsGallery;
