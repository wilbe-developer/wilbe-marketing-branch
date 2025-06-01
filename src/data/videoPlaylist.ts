
export interface VideoItem {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
  description: string;
}

export const videoPlaylist: VideoItem[] = [
  {
    id: 1,
    title: "From PhD to $100M: Dr. Maria Rodriguez's Journey",
    duration: "24:30",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Founder Stories",
    description: "How a failed cancer drug became revolutionary gene therapy",
  },
  {
    id: 2,
    title: "CRISPR's $50B Market: Dr. Jennifer Doudna Interview",
    duration: "18:45",
    thumbnail: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Science Deep Dive",
    description: "The future of gene editing and biotechnology startups",
  },
  {
    id: 3,
    title: "Pitch Perfect: Biotech Edition Masterclass",
    duration: "32:15",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Masterclass",
    description: "5 pitch deck mistakes that kill science startups",
  },
  {
    id: 4,
    title: "Inside a $50M Biotech Lab Tour",
    duration: "15:20",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Lab Tours",
    description: "Exclusive behind-the-scenes at cutting-edge research facilities",
  },
  {
    id: 5,
    title: "Climate Tech Scaling: Climeworks Case Study",
    duration: "28:10",
    thumbnail: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Case Studies",
    description: "From lab breakthrough to $110M Series C funding",
  },
  {
    id: 6,
    title: "Building Teams Over Technology",
    duration: "8:42",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "CEO Insights",
    description: "Dr. Tim Fell on what investors really fund",
  },
  {
    id: 7,
    title: "From Vision to Execution",
    duration: "12:15",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Scaling",
    description: "Dr. Christoph Gebald on growth rounds vs early stage",
  },
  {
    id: 8,
    title: "Hiring for Values First",
    duration: "15:30",
    thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    category: "Culture",
    description: "Dr. Karsten Temme on building startup culture",
  },
];
