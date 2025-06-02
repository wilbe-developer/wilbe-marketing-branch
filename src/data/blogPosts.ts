
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  featuredImage: string;
  slug: string;
  readTime: number;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Science Entrepreneurship: Trends and Opportunities",
    excerpt: "Exploring the evolving landscape of science-based startups and the opportunities that lie ahead for entrepreneur scientists.",
    content: "Science entrepreneurship is experiencing unprecedented growth as breakthrough technologies emerge from research labs around the world. The convergence of artificial intelligence, biotechnology, and advanced materials is creating new markets and opportunities for scientist-founders...",
    author: "Dr. Sarah Chen",
    date: "2024-12-01",
    category: "Science Entrepreneurship",
    featuredImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
    slug: "future-science-entrepreneurship",
    readTime: 8,
    tags: ["entrepreneurship", "innovation", "startups"]
  },
  {
    id: "2",
    title: "Securing Funding for Deep Tech Ventures: A Comprehensive Guide",
    excerpt: "Navigate the complex world of deep tech funding with insights from successful entrepreneurs and investors.",
    content: "Deep tech ventures face unique challenges when seeking funding. Unlike traditional software startups, deep tech companies often require substantial capital for R&D, longer development timelines, and specialized expertise...",
    author: "Michael Rodriguez",
    date: "2024-11-28",
    category: "Funding",
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    slug: "securing-funding-deep-tech",
    readTime: 12,
    tags: ["funding", "deep tech", "venture capital"]
  },
  {
    id: "3",
    title: "Building Effective Research Teams: Lessons from the Lab to the Boardroom",
    excerpt: "Learn how to transition from academic collaboration to building high-performing commercial research teams.",
    content: "The transition from academic research to commercial R&D requires a fundamental shift in how teams are structured and managed. While academic teams focus on publication and knowledge sharing, commercial teams must balance innovation with market demands...",
    author: "Dr. Emma Watson",
    date: "2024-11-25",
    category: "Team Building",
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    slug: "building-effective-research-teams",
    readTime: 10,
    tags: ["team building", "leadership", "research"]
  },
  {
    id: "4",
    title: "Intellectual Property Strategy for Science Startups",
    excerpt: "Protect your innovations and build a strong IP portfolio that attracts investors and partners.",
    content: "Intellectual property forms the foundation of most science-based startups. A well-crafted IP strategy not only protects your innovations but also creates value that can attract investors, partners, and customers...",
    author: "Dr. James Liu",
    date: "2024-11-22",
    category: "IP & Legal",
    featuredImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop",
    slug: "intellectual-property-strategy",
    readTime: 15,
    tags: ["intellectual property", "legal", "patents"]
  },
  {
    id: "5",
    title: "From Lab Bench to Market: Scaling Scientific Innovations",
    excerpt: "Discover the critical steps needed to transform laboratory breakthroughs into market-ready products.",
    content: "The journey from scientific discovery to commercial product is complex and fraught with challenges. Many promising technologies fail to reach the market not because of technical limitations, but due to inadequate commercialization strategies...",
    author: "Dr. Ana Petrova",
    date: "2024-11-19",
    category: "Commercialization",
    featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    slug: "lab-bench-to-market",
    readTime: 11,
    tags: ["commercialization", "product development", "scaling"]
  },
  {
    id: "6",
    title: "The Role of Mentorship in Science Entrepreneurship",
    excerpt: "How experienced entrepreneurs and advisors can accelerate your journey from scientist to founder.",
    content: "Mentorship plays a crucial role in the success of science entrepreneurs. Having access to experienced advisors who understand both the scientific and business aspects of commercialization can significantly impact a startup's trajectory...",
    author: "Dr. Robert Kim",
    date: "2024-11-16",
    category: "Mentorship",
    featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    slug: "role-of-mentorship",
    readTime: 7,
    tags: ["mentorship", "networking", "guidance"]
  },
  {
    id: "7",
    title: "Navigating Regulatory Challenges in Biotech Startups",
    excerpt: "Understanding the regulatory landscape and building compliance into your product development process.",
    content: "Biotech startups face one of the most complex regulatory environments of any industry. From FDA approvals to international standards, navigating these requirements while maintaining innovation momentum requires careful planning...",
    author: "Dr. Lisa Zhang",
    date: "2024-11-13",
    category: "Regulatory",
    featuredImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    slug: "navigating-regulatory-challenges",
    readTime: 13,
    tags: ["regulatory", "biotech", "compliance"]
  },
  {
    id: "8",
    title: "Data-Driven Decision Making for Science Entrepreneurs",
    excerpt: "Leverage data analytics and metrics to make informed decisions and drive business growth.",
    content: "In today's data-rich environment, science entrepreneurs have unprecedented access to information that can guide strategic decisions. From market research to customer analytics, data-driven approaches are becoming essential...",
    author: "Dr. Marcus Thompson",
    date: "2024-11-10",
    category: "Data Analytics",
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    slug: "data-driven-decision-making",
    readTime: 9,
    tags: ["data analytics", "decision making", "metrics"]
  }
];

export const categories = [
  "All",
  "Science Entrepreneurship",
  "Funding",
  "Team Building",
  "IP & Legal",
  "Commercialization",
  "Mentorship",
  "Regulatory",
  "Data Analytics"
];
