import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const founders = [
  {
    name: "Kärt Tomberg",
    title: "Co-founder & CEO",
    company: "ExpressionEdits",
    description: "Redefining the status quo of protein expression",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//kart.png"
  }, {
    name: "Francesco Sciortino",
    title: "Co-founder & CEO",
    company: "Proxima Fusion",
    description: "Bridging the energy of stars to Earth with fusion power plants",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//francesco.png"
  }, {
    name: "Assia Kasdi",
    title: "Co-founder & CEO",
    company: "Milvus Advanced",
    description: "Developing affordable substitutes to rare Earth materials",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//assia.png"
  }, {
    name: "Shamit Shrivastava",
    title: "Co-founder & CEO",
    company: "Apoha",
    description: "Building the first machine that understands sensory data",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//shamit.png"
  }, {
    name: "Alexandre Webster",
    title: "Co-founder & CSO",
    company: "U-Ploid",
    description: "The egg rejuvenation company",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alex.jpeg"
  }, {
    name: "Ola Hekselman",
    title: "Co-founder & CEO",
    company: "Solveteq",
    description: "Next generation battery recycling",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Ola.png"
  }, {
    name: "Liviu Mantescu",
    title: "Co-founder & CEO",
    company: "Watergenics",
    description: "Making water quality visible",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Liviu.png"
  }, {
    name: "Salpie Nowinski",
    title: "Co-founder & CEO",
    company: "Hijack Bio",
    description: "Leveraging bacteria for the future of medicine",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Salpie.png"
  }, {
    name: "Aaron Crapster",
    title: "Co-founder & CEO",
    company: "Anther Therapeutics",
    description: "Non-hormonal male contraceptives",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Aaron.png"
  }, {
    name: "Alex Evans",
    title: "Co-founder & CEO",
    company: "Alceus Bio",
    description: "Programming single cells to cure solid cancers",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alex.png"
  }, {
    name: "Spencer Matonis",
    title: "Co-founder & CEO",
    company: "Edulis Therapeutics",
    description: "Localised drug delivery for gastrointestinal disease",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Spencer.png"
  }, {
    name: "Carmen Kivisild",
    title: "Co-founder & CEO",
    company: "ElnoraAI",
    description: "Optimising data capturing to accelerate drug discovery",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Carmen.png"
  },
  // Adding the new founders
  {
    name: "Thomas-Louis de Lophem",
    title: "Co-founder & CEO",
    company: "MinersAI",
    description: "GIS platform and AI-driven insights for mineral exploration",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Thomas-Louis.png"
  }, {
    name: "Alberto Conti",
    title: "Co-founder & CSO",
    company: "Alceus Bio",
    description: "Programming single cells to cure solid cancers",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alberto.png"
  }, {
    name: "Max Mossner",
    title: "Co-founder & CTO",
    company: "Hijack Bio",
    description: "Leveraging bacteria for the future of medicine",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Max.png"
  }, {
    name: "Zahra Jawad",
    title: "Founder & CEO",
    company: "Creasallis",
    description: "Antibody remodelling to improve treatment of solid tumours",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Zahra.png"
  }, {
    name: "Vikram Bakaraju",
    title: "Founder & CEO",
    company: "Pavakah Energy",
    description: "Solar paint",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Vikram.png"
  }
];

const WhySection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  // Default number of founders to show
  const defaultVisibleCount = 8;
  // Display all founders when expanded, otherwise show only the default count
  const displayFounders = isExpanded ? founders : founders.slice(0, defaultVisibleCount);
  
  return <section className="container my-32">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-24">
        <div className="text-6xl font-black">03 //</div>
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl">The scientists who became founders with us</h2>
      </div>

      {isMobile ? <Carousel opts={{
      align: "start",
      loop: true
    }} className="w-full">
          <CarouselContent>
            {founders.map((founder, idx) => <CarouselItem key={idx} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-4 bg-black border border-white/30 hover:border-[#7ED957] transition-colors relative overflow-hidden rounded-none h-72">
                  {/* Semi-transparent overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  
                  {founder.image ? <img src={founder.image} alt={founder.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-zinc-900 flex items-center justify-center">
                      <span className="text-white/50">{founder.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>}
                  
                  {/* Info always visible at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                    <h3 className="font-bold">{founder.name}</h3>
                    <p className="text-[#7ED957]">{founder.title}, {founder.company}</p>
                    <p className="text-sm mt-1 text-white/70">{founder.description}</p>
                  </div>
                </div>
              </CarouselItem>)}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative static border-[#7ED957] text-[#7ED957] hover:bg-[#7ED957]/20 mr-4 rounded-none" />
            <CarouselNext className="relative static border-[#7ED957] text-[#7ED957] hover:bg-[#7ED957]/20 ml-4 rounded-none" />
          </div>
        </Carousel> : <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayFounders.map((founder, idx) => <div key={idx} className="p-4 bg-black border border-white/30 hover:border-[#7ED957] transition-colors relative overflow-hidden rounded-none" onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                {/* Semi-transparent overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                
                {founder.image ? <img src={founder.image} alt={founder.name} className="h-64 w-full object-cover" /> : <div className="h-64 w-full bg-zinc-900 flex items-center justify-center">
                    <span className="text-white/50">{founder.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>}
                
                {/* Info always visible at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                  <h3 className="font-bold">{founder.name}</h3>
                  <p className="text-[#7ED957]">{founder.title}, {founder.company}</p>
                  
                  {/* Description only visible on hover */}
                  {hoveredIndex === idx && <p className="text-sm mt-1 text-white/70 transition-opacity duration-300">{founder.description}</p>}
                </div>
              </div>)}
          </div>
          
          {/* Show more/less button */}
          {founders.length > defaultVisibleCount && <div className="flex justify-center mt-12">
              <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline" className="border border-white/30 hover:border-[#7ED957] bg-[#7ed957] text-[00000] text-black rounded-none">
                {isExpanded ? <>
                    <span>Show Less</span>
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </> : <>
                    <span>Show More</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>}
              </Button>
            </div>}
        </>}
    </section>;
};

export default WhySection;
