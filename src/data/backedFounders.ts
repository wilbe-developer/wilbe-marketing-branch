
export interface BackedFounder {
  id: number;
  name: string;
  title: string;
  company: string;
  image: string;
  description: string;
  fundingRound?: string;
  sector: string;
}

export const backedFounders: BackedFounder[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Co-founder & CEO",
    company: "NeuroLink Therapeutics",
    image: "/lovable-uploads/3e738ede-3221-440e-8abf-282324291fe2.png",
    description: "Developing brain-computer interfaces for neurological disorders",
    fundingRound: "Series A",
    sector: "Biotech"
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    title: "Founder & CTO",
    company: "Carbon Capture Labs",
    image: "/lovable-uploads/59e3659c-9de4-457d-b70a-b1047d15237e.png",
    description: "Revolutionary atmospheric carbon removal technology",
    fundingRound: "Seed",
    sector: "Climate Tech"
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    title: "Co-founder & CEO",
    company: "Quantum Materials Inc",
    image: "/lovable-uploads/783800c2-496d-4441-b067-52820a7f1ad8.png",
    description: "Next-generation quantum computing materials",
    fundingRound: "Series B",
    sector: "Quantum Tech"
  },
  {
    id: 4,
    name: "Dr. James Liu",
    title: "Founder & CEO",
    company: "BioSensor Dynamics",
    image: "/lovable-uploads/80934f40-f381-433a-afea-69f37fe637ab.png",
    description: "Wearable biosensors for continuous health monitoring",
    fundingRound: "Series A",
    sector: "MedTech"
  },
  {
    id: 5,
    name: "Dr. Maria Gonzalez",
    title: "Co-founder & CSO",
    company: "AgriGenome Solutions",
    image: "/lovable-uploads/86efc3b2-8104-4252-9196-0b3226d6247a.png",
    description: "CRISPR-based crop improvement technologies",
    fundingRound: "Seed",
    sector: "AgTech"
  },
  {
    id: 6,
    name: "Dr. David Park",
    title: "Founder & CEO",
    company: "CleanEnergy Fusion",
    image: "/lovable-uploads/8d392a7c-c41b-4f91-a559-700227cf100a.png",
    description: "Compact fusion reactors for clean energy",
    fundingRound: "Series A",
    sector: "Energy"
  },
  {
    id: 7,
    name: "Dr. Rachel Thompson",
    title: "Co-founder & CEO",
    company: "NanoMedicine Corp",
    image: "/lovable-uploads/c261565b-ab74-49b1-9be1-70ed67d32191.png",
    description: "Targeted drug delivery using nanotechnology",
    fundingRound: "Series B",
    sector: "Pharma"
  },
  {
    id: 8,
    name: "Dr. Ahmed Hassan",
    title: "Founder & CTO",
    company: "SpaceTech Innovations",
    image: "/lovable-uploads/d2adef55-edba-455a-9952-2a1d35e7f7c7.png",
    description: "Advanced propulsion systems for space exploration",
    fundingRound: "Seed",
    sector: "Aerospace"
  },
  {
    id: 9,
    name: "Dr. Lisa Anderson",
    title: "Co-founder & CEO",
    company: "AI Diagnostics",
    image: "/lovable-uploads/d2c1a955-3ce2-47b2-91d4-0cb095b83a8d.png",
    description: "AI-powered medical imaging diagnostics",
    fundingRound: "Series A",
    sector: "AI/ML"
  },
  {
    id: 10,
    name: "Dr. Robert Kim",
    title: "Founder & CEO",
    company: "Ocean Clean Tech",
    image: "/lovable-uploads/e63aae6f-8753-4509-aff4-323cac4af598.png",
    description: "Autonomous systems for ocean plastic removal",
    fundingRound: "Seed",
    sector: "Environmental"
  },
  {
    id: 11,
    name: "Dr. Jennifer Martinez",
    title: "Co-founder & CSO",
    company: "Synthetic Biology Labs",
    image: "/lovable-uploads/ec58856d-e030-4ce2-806d-cc07bd376fe5.png",
    description: "Engineered microbes for sustainable manufacturing",
    fundingRound: "Series A",
    sector: "SynBio"
  },
  {
    id: 12,
    name: "Dr. Thomas Wilson",
    title: "Founder & CEO",
    company: "Robotics Healthcare",
    image: "/lovable-uploads/f6b0b0f6-7fbb-4aa3-b9f4-833ce7960135.png",
    description: "Surgical robotics with haptic feedback",
    fundingRound: "Series B",
    sector: "Robotics"
  }
];
