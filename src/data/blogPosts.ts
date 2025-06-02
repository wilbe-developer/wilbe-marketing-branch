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
    id: "9",
    title: "Two playbooks for research commercialization (we spearheaded the second one)",
    excerpt: "Exploring why traditional university research commercialization has failed and introducing an alternative playbook that leverages scientist-founders' capacity to create defensible technology based on real-world market needs.",
    content: "As non-scientist venture investors adamant about seeing more solutions being developed to tackle some of the most imperative challenges of this century, we started by questioning why we were not seeing more university research being commercialized and quickly realized that the problem lies in the mindset of universities and the legacy operators around them: the entire focus has been on the value of the IP and not the capacity of the creators behind it. Imagine limiting yourself to a single Leonardo's drawing (IP) as opposed to his potential ability to create, iterate, test, and refine products. Historically, universities have framed the role of researchers as producers of papers in an academic world that prioritizes publishing, citations, and public grants as a form of track record.\n\nThe legacy playbook of universities has been based mainly on framing an entire company around the value of an individual piece of IP, regardless of how well this was tested in the real world. Any invention that occurs in academia is valued for its novelty instead of its ability to drive impact, so science commercialization has inevitably focused on finding a market that fits the IP produced as opposed to building IP for markets that desperately need that level of innovation. And instead of leveraging the talent of the inventor, the legacy playbook focused on recruiting professional management, typically former executives, MBAs, or consultants, who perhaps held great experience at running businesses but very limited instinct and understanding for starting one. The lack of a fit for the technology and appropriateness of the leadership meant that, inevitably, most companies see a high churn of business strategies, people, and broken cap tables.\n\nWe believed in an alternative playbook. As operators (and lawyers), we interpreted IP as an asset merely demonstrating that the inventor was capable of producing defensible technology. Instead of putting the inventor in a corner and forcing IP onto a market, we believed we could leverage the inventor's capacity to develop further and better IP based on their understanding of the real world and the needs of the market. When provided with the support, we have been able to demonstrate that some make much more relevant leaders to start the company compared to external managers, capable of inspiring world-class talent to join them in the mission, holding commercial conversations with early customers, and attracting aligned investors. The best-performing ventures in our Fund I portfolio started without IP, focusing on understanding the problem to be solved, the market opportunity, and defining a strategy before leveraging their know-how to generate defensible technology.\n\nThere are 8.8 million scientists in the world. Perhaps not every one of them can or wishes to lead a company, but any company led by a scientist can become an industry's challenger, for as long as the scientist holds both the technical know-how and an appreciation for real-world dynamics. Through the Wilbe platform, we empower scientists with that appreciation and identify those who are able to convert into the leaders of this century. This is not unlike the Elons and the Zucks in traditional software during the early aughties: a whole generation of engineers who did not need MBAs to start tech empires. How many scientist leaders do you know? Very soon, you will. Our playbook is fast at work.",
    author: "Alessandro Philip Maiano",
    date: "2024-03-28",
    category: "Commercialization",
    featuredImage: "/lovable-uploads/afaf19f2-febd-43bf-ac24-d67454580b3f.png",
    slug: "two-playbooks-research-commercialization",
    readTime: 3,
    tags: ["commercialization", "science entrepreneurship", "science founder", "spinouts"]
  },
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
