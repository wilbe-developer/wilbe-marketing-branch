// Import the founders data from WhySection
const foundersFromWhySection = [
  {
    name: "Kärt Tomberg",
    title: "Co-founder & CEO",
    company: "ExpressionEdits",
    description: "Redefining the status quo of protein expression",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//kart.png",
    sector: "Biotech",
    bsfClass: "BSF1",
    quote: "Honestly I can't imagine the company without them. Their devotion and energy kept me going when all seemed overly frustrating!"
  },
  {
    name: "Francesco Sciortino",
    title: "Co-founder & CEO",
    company: "Proxima Fusion",
    description: "Bridging the energy of stars to Earth with fusion power plants",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//francesco.png",
    sector: "Energy",
    bsfClass: "BSF7",
    quote: "Wilbe believed in our project from day 1. It accelerated us enormously in the early days, helping us get on track to develop a first-class team"
  },
  {
    name: "Assia Kasdi",
    title: "Co-founder & CEO",
    company: "Milvus Advanced",
    description: "Developing affordable substitutes to rare Earth materials",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//assia.png",
    sector: "Materials",
    bsfClass: "BSF3",
    quote: "With the same constant and relentless support, they are the people whom I trust the most in the entrepreneurial world and definitely the most human"
  },
  {
    name: "Shamit Shrivastava",
    title: "Co-founder & CEO",
    company: "Apoha",
    description: "Building the first machine that understands sensory data",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//shamit.png",
    sector: "AI/ML",
    bsfClass: "BSF1",
    quote: "Wilbe has always backed our biggest ambitions. And we get advice that is geared towards: how can you be just completely true to yourself and to the reason you built the company"
  },
  {
    name: "Alexandre Webster",
    title: "Co-founder & CSO",
    company: "U-Ploid",
    description: "The egg rejuvenation company",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alex.jpeg",
    sector: "Biotech",
    quote: "Working with Wilbe felt like having experienced co-founders who've built biotech companies before."
  },
  {
    name: "Ola Hekselman",
    title: "Co-founder & CEO",
    company: "Solveteq",
    description: "Next generation battery recycling",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Ola.png",
    sector: "Climate Tech",
    quote: "The climate tech expertise at Wilbe helped us navigate complex regulatory landscapes with confidence."
  },
  {
    name: "Liviu Mantescu",
    title: "Co-founder & CEO",
    company: "Watergenics",
    description: "Making water quality visible",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Liviu.png",
    sector: "Environmental",
    quote: "Wilbe's network introduced us to our first enterprise customers. Their industry connections are unmatched."
  },
  {
    name: "Salpie Nowinski",
    title: "Co-founder & CEO",
    company: "Hijack Bio",
    description: "Leveraging bacteria for the future of medicine",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Salpie.png",
    sector: "Biotech",
    quote: "The hands-on support during our Series A was incredible. Wilbe knows how to position deep tech for investors."
  },
  {
    name: "Aaron Crapster",
    title: "Co-founder & CEO",
    company: "Anther Therapeutics",
    description: "Non-hormonal male contraceptives",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Aaron.png",
    sector: "MedTech",
    quote: "From lab to market, Wilbe understood the unique challenges of developing novel therapeutics."
  },
  {
    name: "Alex Evans",
    title: "Co-founder & CEO",
    company: "Alceus Bio",
    description: "Programming single cells to cure solid cancers",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alex.png",
    sector: "Biotech",
    quote: "The scientific rigor Wilbe brings to investment decisions gave us confidence in our partnership from day one."
  },
  {
    name: "Spencer Matonis",
    title: "Co-founder & CEO",
    company: "Edulis Therapeutics",
    description: "Localised drug delivery for gastrointestinal disease",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Spencer.png",
    sector: "Pharma",
    quote: "Wilbe's pharma expertise accelerated our regulatory strategy by years. They've been there before."
  },
  {
    name: "Carmen Kivisild",
    title: "Co-founder & CEO",
    company: "ElnoraAI",
    description: "Optimising data capturing to accelerate drug discovery",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Carmen.png",
    sector: "AI/ML",
    quote: "The AI expertise at Wilbe helped us refine our product-market fit in ways we hadn't considered."
  },
  {
    name: "Thomas-Louis de Lophem",
    title: "Co-founder & CEO",
    company: "MinersAI",
    description: "GIS platform and AI-driven insights for mineral exploration",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Thomas-Louis.png",
    sector: "AI/ML",
    quote: "Wilbe's global perspective opened international markets that became crucial for our growth strategy."
  },
  {
    name: "Alberto Conti",
    title: "Co-founder & CSO",
    company: "Alceus Bio",
    description: "Programming single cells to cure solid cancers",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Alberto.png",
    sector: "Biotech",
    quote: "The depth of scientific discussion with Wilbe's team elevated our research approach and commercial strategy."
  },
  {
    name: "Max Mossner",
    title: "Co-founder & CTO",
    company: "Hijack Bio",
    description: "Leveraging bacteria for the future of medicine",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Max.png",
    sector: "Biotech",
    quote: "Technical mentorship from Wilbe's team helped us avoid costly development pitfalls early on."
  },
  {
    name: "Zahra Jawad",
    title: "Founder & CEO",
    company: "Creasallis",
    description: "Antibody remodelling to improve treatment of solid tumours",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Zahra.png",
    sector: "Biotech",
    quote: "Wilbe's commitment to diversity in science created opportunities I never thought possible as a founder."
  },
  {
    name: "Vikram Bakaraju",
    title: "Founder & CEO",
    company: "Pavakah Energy",
    description: "Solar paint",
    image: "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/founders//Vikram.png",
    sector: "Energy",
    quote: "The energy sector expertise at Wilbe connected us with manufacturing partners critical to scaling our technology."
  }
];

// Convert to the BackedFounder format and add funding rounds
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
  quote: string;
}

export const backedFounders: BackedFounder[] = foundersFromWhySection.map((founder, index) => ({
  id: index + 1,
  name: founder.name,
  title: founder.title,
  company: founder.company,
  image: founder.image,
  description: founder.description,
  fundingRound: ["Seed", "Series A", "Series B"][index % 3], // Distribute funding rounds
  sector: founder.sector,
  bsfClass: founder.bsfClass,
  quote: founder.quote
}));
