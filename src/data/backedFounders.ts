// Import the founders data from WhySection
const foundersFromWhySection = [
  {
    name: "Kärt Tomberg",
    title: "Co-founder & CEO",
    company: "ExpressionEdits",
    description: "Redefining the status quo of protein expression",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//kart.png",
    sector: "Biotech",
    bsfClass: "BSF1"
  },
  {
    name: "Francesco Sciortino",
    title: "Co-founder & CEO",
    company: "Proxima Fusion",
    description: "Bridging the energy of stars to Earth with fusion power plants",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//francesco.png",
    sector: "Energy",
    bsfClass: "BSF7"
  },
  {
    name: "Assia Kasdi",
    title: "Co-founder & CEO",
    company: "Milvus Advanced",
    description: "Developing affordable substitutes to rare Earth materials",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//assia.png",
    sector: "Materials",
    bsfClass: "BSF3"
  },
  {
    name: "Shamit Shrivastava",
    title: "Co-founder & CEO",
    company: "Apoha",
    description: "Building the first machine that understands sensory data",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//shamit.png",
    sector: "AI/ML",
    bsfClass: "BSF1"
  },
  {
    name: "Alexandre Webster",
    title: "Co-founder & CSO",
    company: "U-Ploid",
    description: "The egg rejuvenation company",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alex.jpeg",
    sector: "Biotech"
  },
  {
    name: "Ola Hekselman",
    title: "Co-founder & CEO",
    company: "Solveteq",
    description: "Next generation battery recycling",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Ola.png",
    sector: "Climate Tech"
  },
  {
    name: "Liviu Mantescu",
    title: "Co-founder & CEO",
    company: "Watergenics",
    description: "Making water quality visible",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Liviu.png",
    sector: "Environmental"
  },
  {
    name: "Salpie Nowinski",
    title: "Co-founder & CEO",
    company: "Hijack Bio",
    description: "Leveraging bacteria for the future of medicine",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Salpie.png",
    sector: "Biotech"
  },
  {
    name: "Aaron Crapster",
    title: "Co-founder & CEO",
    company: "Anther Therapeutics",
    description: "Non-hormonal male contraceptives",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Aaron.png",
    sector: "MedTech"
  },
  {
    name: "Alex Evans",
    title: "Co-founder & CEO",
    company: "Alceus Bio",
    description: "Programming single cells to cure solid cancers",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alex.png",
    sector: "Biotech"
  },
  {
    name: "Spencer Matonis",
    title: "Co-founder & CEO",
    company: "Edulis Therapeutics",
    description: "Localised drug delivery for gastrointestinal disease",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Spencer.png",
    sector: "Pharma"
  },
  {
    name: "Carmen Kivisild",
    title: "Co-founder & CEO",
    company: "ElnoraAI",
    description: "Optimising data capturing to accelerate drug discovery",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Carmen.png",
    sector: "AI/ML"
  },
  {
    name: "Thomas-Louis de Lophem",
    title: "Co-founder & CEO",
    company: "MinersAI",
    description: "GIS platform and AI-driven insights for mineral exploration",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Thomas-Louis.png",
    sector: "AI/ML"
  },
  {
    name: "Alberto Conti",
    title: "Co-founder & CSO",
    company: "Alceus Bio",
    description: "Programming single cells to cure solid cancers",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alberto.png",
    sector: "Biotech"
  },
  {
    name: "Max Mossner",
    title: "Co-founder & CTO",
    company: "Hijack Bio",
    description: "Leveraging bacteria for the future of medicine",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Max.png",
    sector: "Biotech"
  },
  {
    name: "Zahra Jawad",
    title: "Founder & CEO",
    company: "Creasallis",
    description: "Antibody remodelling to improve treatment of solid tumours",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Zahra.png",
    sector: "Biotech"
  },
  {
    name: "Vikram Bakaraju",
    title: "Founder & CEO",
    company: "Pavakah Energy",
    description: "Solar paint",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Vikram.png",
    sector: "Energy"
  }
];

export interface BackedFounder {
  id: number;
  name: string;
  title: string;
  company: string;
  image: string;
  description: string;
  fundingRound?: string;
  sector: string;
  bsfClass?: string;
}

// Convert to the BackedFounder format and add funding rounds
export const backedFounders: BackedFounder[] = foundersFromWhySection.map((founder, index) => ({
  id: index + 1,
  name: founder.name,
  title: founder.title,
  company: founder.company,
  image: founder.image,
  description: founder.description,
  fundingRound: ["Seed", "Series A", "Series B"][index % 3], // Distribute funding rounds
  sector: founder.sector,
  bsfClass: founder.bsfClass
}));
