
import React, { useState } from 'react';
import Section from './Section';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const founders = [
  {
    name: "Kärt Tomberg",
    title: "Co-founder & CEO",
    company: "ExpressionEdits",
    description: "Redefining the status quo of protein expression",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//kart.png"
  },
  {
    name: "Francesco Sciortino",
    title: "Co-founder & CEO",
    company: "Proxima Fusion",
    description: "Bridging the energy of stars to Earth with fusion power plants",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//francesco.png"
  },
  {
    name: "Assia Kasdi",
    title: "Co-founder & CEO",
    company: "Milvus Advanced",
    description: "Developing affordable substitutes to rare Earth materials",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//assia.png"
  },
  {
    name: "Shamit Shrivastava",
    title: "Co-founder & CEO",
    company: "Apoha",
    description: "Building the first machine that understands sensory data",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//shamit.png"
  },
  {
    name: "Alexandre Webster",
    title: "Co-founder & CSO",
    company: "U-Ploid",
    description: "The egg rejuvenation company",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alex.jpeg"
  },
  {
    name: "Ola Hekselman",
    title: "Co-founder & CEO",
    company: "Solveteq",
    description: "Next generation battery recycling",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Ola.png"
  },
  {
    name: "Liviu Mantescu",
    title: "Co-founder & CEO",
    company: "Watergenics",
    description: "Making water quality visible",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Liviu.png"
  },
  {
    name: "Salpie Nowinski",
    title: "Co-founder & CEO",
    company: "Hijack Bio",
    description: "Leveraging bacteria for the future of medicine",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Salpie.png"
  },
  {
    name: "Aaron Crapster",
    title: "Co-founder & CEO",
    company: "Anther Therapeutics",
    description: "Non-hormonal male contraceptives",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Aaron.png"
  },
  {
    name: "Alex Evans",
    title: "Co-founder & CEO",
    company: "Alceus Bio",
    description: "Programming single cells to cure solid cancers",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alex.png"
  },
  {
    name: "Spencer Matonis",
    title: "Co-founder & CEO",
    company: "Edulis Therapeutics",
    description: "Localised drug delivery for gastrointestinal disease",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Spencer.png"
  },
  {
    name: "Carmen Kivisild",
    title: "Co-founder & CEO",
    company: "ElnoraAI",
    description: "Optimising data capturing to accelerate drug discovery",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Carmen.png"
  },
  {
    name: "Thomas-Louis de Lophem",
    title: "Co-founder & CEO",
    company: "MinersAI",
    description: "GIS platform and AI-driven insights for mineral exploration",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Thomas-Louis.png"
  },
  {
    name: "Alberto Conti",
    title: "Co-founder & CSO",
    company: "Alceus Bio",
    description: "Programming single cells to cure solid cancers",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alberto.png"
  },
  {
    name: "Max Mossner",
    title: "Co-founder & CTO",
    company: "Hijack Bio",
    description: "Leveraging bacteria for the future of medicine",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Max.png"
  },
  {
    name: "Zahra Jawad",
    title: "Founder & CEO",
    company: "Creasallis",
    description: "Antibody remodelling to improve treatment of solid tumours",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Zahra.png"
  },
  {
    name: "Vikram Bakaraju",
    title: "Founder & CEO",
    company: "Pavakah Energy",
    description: "Solar paint",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Vikram.png"
  }
];

const WhySection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Section className="bg-white">
      <h2 className="text-3xl font-bold mb-10">The scientists who became founders with us</h2>
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {founders.map((founder, idx) => (
              <CarouselItem key={idx} className="pl-2 basis-full sm:basis-1/2 md:basis-1/3">
                <div 
                  className="p-4 bg-zinc-50 rounded-md h-64 relative overflow-hidden"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Permanent semi-transparent overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                  
                  {founder.image ? (
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="h-full w-full bg-zinc-200 flex items-center justify-center">
                      <span className="text-zinc-400">{founder.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  )}
                  
                  {/* Basic info always visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold">{founder.name}</h3>
                    <p className="text-sm">{founder.title}, {founder.company}</p>
                    
                    {/* Description only visible on hover */}
                    {hoveredIndex === idx && (
                      <p className="text-xs mt-1 opacity-80 transition-opacity duration-300">{founder.description}</p>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
            <CarouselPrevious className="relative left-0 translate-y-0 bg-white" />
            <CarouselNext className="relative right-0 translate-y-0 bg-white" />
          </div>
        </Carousel>
      </div>
    </Section>
  );
};

export default WhySection;
