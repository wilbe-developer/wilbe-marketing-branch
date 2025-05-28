
export interface PortfolioCompany {
  id: number;
  name: string;
  founder: string;
  title: string;
  image: string;
  category: string;
  categoryColor: string;
  funding: string;
  description: string;
  background: string;
}

export const portfolioCompanies: PortfolioCompany[] = [
  {
    id: 1,
    name: "Synthace",
    founder: "Dr. Tim Fell",
    title: "CEO & Co-Founder, Synthace",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Biotech",
    categoryColor: "bg-green-600",
    funding: "Series B • $38M",
    description: "We're automating lab workflows to accelerate scientific discovery. Our digital experiment platform is transforming life sciences R&D.",
    background: "Former academic at Imperial College London",
  },
  {
    id: 2,
    name: "Climeworks",
    founder: "Dr. Christoph Gebald",
    title: "CEO & Co-Founder, Climeworks",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "Climate Tech",
    categoryColor: "bg-blue-600",
    funding: "Series C • $110M",
    description: "Our direct air capture technology is removing CO2 from the atmosphere at scale. We're leading the fight against climate change.",
    background: "PhD in Mechanical Engineering from ETH Zurich",
  },
  {
    id: 3,
    name: "Pivot Bio",
    founder: "Dr. Karsten Temme",
    title: "CEO & Co-Founder, Pivot Bio",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "AgTech",
    categoryColor: "bg-yellow-600",
    funding: "Series D • $430M",
    description: "Our nitrogen-fixing microbes are replacing synthetic fertilizers with biological solutions, revolutionizing sustainable agriculture.",
    background: "PhD in Bioengineering from UC Berkeley",
  },
  {
    id: 4,
    name: "Oxford Nanopore",
    founder: "Dr. Gordon Sanghera",
    title: "CEO, Oxford Nanopore",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "MedTech",
    categoryColor: "bg-purple-600",
    funding: "IPO • $5B Valuation",
    description: "Our DNA/RNA sequencing technology enables real-time, portable genetic analysis for research and healthcare applications.",
    background: "PhD in Bioelectronic Technology from Oxford",
  },
  {
    id: 5,
    name: "BioGenesis",
    founder: "Dr. Maria Rodriguez",
    title: "CEO & Founder, BioGenesis",
    image: "https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Gene Therapy",
    categoryColor: "bg-red-600",
    funding: "Series A • $100M",
    description: "We pivoted from a failed cancer drug to revolutionary gene therapy. Our platform is now transforming treatment for rare genetic disorders.",
    background: "Former researcher at Harvard Medical School",
  },
  {
    id: 6,
    name: "NeuroLink Therapeutics",
    founder: "Dr. Sarah Chen",
    title: "CEO, NeuroLink Therapeutics",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Neuroscience",
    categoryColor: "bg-orange-600",
    funding: "Series B • $75M",
    description: "We're developing breakthrough treatments for neurodegenerative diseases using our proprietary brain-computer interface technology.",
    background: "PhD in Neuroscience from Stanford University",
  },
];
