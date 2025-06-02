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
    id: "11",
    title: "Professors: leave \"the kids\" alone - how much startup equity should you take?",
    excerpt: "Five years ago, we began examining the hurdles within academia. We specifically focused on the challenges faced by postdoc researchers when wanting to bring their science into the real world. Understanding the dynamics between researchers and PIs is crucial for realizing successful outcomes in both academic and commercial fields.",
    content: "**Understanding the Culture**\n\nFive years ago, we began examining the hurdles within academia. We specifically focused on the challenges faced by postdoc researchers when wanting to bring their science into the real world. These individuals are full-time scientists who have completed their PhDs and now work within a lab led by a PI (Principal Investigator). A PI's lab can consist of a handful or several dozen students, PhD candidates, and postdoc researchers, depending on the funding and the PI's standing within the university.\n\nAchieving tenure is a significant milestone in this hierarchy, reflecting the status of the PI.\n\nIn my experience with established professors, I quickly learned that many refer to the researchers in their labs as \"my kids.\" This endearing term often symbolizes a sense of responsibility for their apprentices in the lab. The careers of these young scientists are influenced by the guidance they receive.\n\nHowever, many young researchers report troubled relationships with their PIs. The term \"kids\" may also reflect the hierarchical culture in academia. Often, there is an unhealthy focus on status rather than fostering long-term relationships. This dynamic is crucial in a field dependent on human capital, as attracting talent is essential for success.\n\nAs someone trained as an attorney, I understand the importance of a strong apprentice-trainer relationship and its impact when functioning effectively. My lack of emotional ties to academic culture allows me to observe these dynamics more objectively. Consequently, we often offer compassionate, pro-bono support to disgruntled researchers, helping them navigate their next career steps. However, this approach is not sustainable. We cannot provide case-by-case support for every researcher if we want to improve academia's function as a whole. Therefore, increased awareness and systemic change are essential.\n\n**The Scenarios - Are You Using Startup Equity Wisely?**\n\nThe culture within the lab becomes profoundly evident during a spinout and influences the future of science commercialization. Here are the common scenarios we often see:\n\nAn IP \"asset\" (like a patentable discovery or know-how) is developed in the lab.\n\nPhDs or postdocs close to the development of this IP aim to become full-time founders to commercialize it.\n\nThe PI, remaining in academia, usually has limited experience in commercialization.\n\nThe researchers-turned-founders and the PI must negotiate the equity split of the new company.\n\nAt this stage, you encounter two types of PIs:\n\n**Scenario 1: The Supportive PI**\n\nThe first type recognizes that the founder's role requires speed and focus. They understand that their involvement will be minimal and agree to be compensated through their stake held by the TTO. They may ask for a small percentage of the company for continued guidance as scientific advisors.\n\n**Scenario 2: The Controlling PI**\n\nThe second type sees the patented discovery as an extension of their academic ambitions. They believe that by directing postdocs as project managers, they deserve equal or majority shares in the new company. Unfortunately, they still view the researchers as \"the kids\" in the lab.\n\nIf you, as the researcher-turned-founder, find yourself in Scenario 1, here are advantages:\n\nEnough equity to motivate you to fight for the company in the coming years, despite dilution.\n\nSufficient equity in the startup to recruit key team members or create an option pool.\n\nA mature relationship with your PI, who acknowledges your chosen path outside academia and can validate your scientific direction.\n\nBetter chances of attracting funding, as investors will see equitable incentive distribution and a \"clean slate\" approach.\n\nConversely, if you identify with Scenario 2, understand the challenges ahead:\n\nYou may enter with a hierarchy mindset, inhibiting your ability to innovate.\n\nYou risk making slow, costly mistakes under the direction of a PI with limited focus.\n\nThe flawed culture within the company may drive away top talent and breed mistrust.\n\nIt's crucial to note that many PIs in Scenario 2 operate out of good faith. The dynamics of launching a company differ drastically from those of running a lab. They consult peers who have engaged in spinouts but may lack insight into what truly creates successful ventures. TTOs also often focus on preserving academic hierarchies, not on what's best for the company's future.\n\nIf you've already settled on equity numbers, it's not too late to reassess. Cease adding value to the company, including discussions with TTOs or potential investors. Dedicate time to educate your PI on effective company practices and what successful companies execute.\n\nIn some instances, founders have opted to start anew, exploring innovative solutions. These individuals produced superior technologies compared to the original IP and received backing for their initiatives.\n\n**The Advantages for PIs: Embracing Scenario 1**\n\nSome PIs stand out due to their ability to foster an entrepreneurial culture in their labs. By promoting innovative thinking, they attract top talent seeking diverse professional paths, including the chance to become founders.\n\nRetaining this talent allows PIs to continuously explore new ideas and venture into practical applications. In the real world, execution outweighs ideas; while many concepts fail, effective leaders often thrive. The decisions made during the spinout phase will shape not just the lab's culture but also its brand equity. The caliber of leaders attracted in the future hinges on these foundational choices.\n\nIf you're starting your journey as a PI and believe your lab has a viable spinout opportunity, there are resources available. We offer programs to support novice PIs in creating \"spinout-ready\" labs. Curious about how to initiate this journey? Consider guiding prospective scientist founders to join Sandbox and apply to Bootcamp.\n\n**Conclusion**\n\nAcademia is a vibrant but challenging landscape, especially for postdoc researchers. Understanding the dynamics between researchers and PIs is crucial for realizing successful outcomes in both academic and commercial fields. By fostering a supportive culture and recognizing the unique paths of researchers, we can pave the way for innovative discovery and entrepreneurial success.\n\n**Wilbe Resources for Entrepreneurial Scientists:**\n\nVenture + career resources and community: Sandbox\n\nPrep for your first round: Bootcamp\n\nPitch for funding: Wilbe.Capital\n\nHelp with finding a lab: Wilbe Labs",
    author: "Alessandro Philip Maiano",
    date: "2024-02-11",
    category: "Science Entrepreneurship",
    featuredImage: "/lovable-uploads/7a3c1066-8e9d-4660-8838-e45a7de50fe7.png",
    slug: "professors-leave-kids-alone-startup-equity",
    readTime: 4,
    tags: ["academia", "equity", "spinouts", "science entrepreneurship", "PI relationships", "startup founding"]
  },
  {
    id: "10",
    title: "Science as the most valuable luxury - and why you should consider investing in Science",
    excerpt: "The biggest threats to survival are caused by socially induced problems that can be made manageable through science. This is what therapeutics and novel materials achieve. Whichever country and individual has access to the know-how and the ability to develop solutions to security, obesity, depression, fertility, and energy holds the keys to a longer-lasting lifespan and upkeep of generational prosperity.",
    content: "The biggest threats to survival are caused by socially induced problems that can be made manageable through science. This is what therapeutics and novel materials achieve. Whichever country and individual has access to the know-how and the ability to develop solutions to security, obesity, depression, fertility, and energy holds the keys to a longer-lasting lifespan and upkeep of generational prosperity. Yes, in the long term, we would wish to be able to solve the above problems at its root by addressing bad habits, engaging in diplomacy with malign agents and education, but at a time of crisis like the one we live in today science is offering a crucial lifeline.\n\nAs social scientists and venture operators, we realized that policy moves far slower than capital and individual ingenuity and over the last 5 years we have dedicated our skills to reading signals around what the future may entail and producing contingency plans by identifying the solutions that would be most viable and deploy our venture playbook to empower the selected agents that can deliver these solutions at scale: scientists.\n\nScientists for a long time have been getting the raw end of the stick. Either recruited by corporates to jump through board-commanded R&D exercises or stuck in academic ecosystems that favor publishing virtues over practical impact. Five years ago we realized that for as long as scientists were hindered from creating freely, all the public and private funding going towards generating solutions to the above challenges would be ineffective. We started envisaging a world where the most technically prepared individuals would also be able to access the research infrastructure, market guidance, and capital network to reduce research timelines and increase success rates. An infrastructure that we have now delivered at Wilbe.\n\nEarlier this month our very own Proxima Fusion (a Fund I venture) was featured in the WSJ, FT, and Bloomberg sharing that their version of nuclear fusion power may be much closer than decades of government investments have been able to achieve. Proxima was founded by Francesco, until November 2022 a postdoc researcher at MIT and Max Planck. The same fall he applied and was selected for our BSF program (then, \"Become a Scientist Founder\") equipping him with the skills to pursue his research full-time in the real world: within 2 weeks from incorporating the company with him and a cracking team of co-founders from Cupertino to Cambridge MA, we secured a visionary public-private-partnership and a lead investor to join us in the round. The company in little more than two years has taken a lead role in the sector, securing over $30M in private funding and matching funding from governments. Without energy companies like Proxima, all the goodwill expectations around the potential of AI and the renaissance of industrialization in the Western World are wishful thinking. We started taking an interest in Proxima at a time when most governments were solely focused on alternative energy like solar and wind, ineffective for the problem at hand: we read the social signals and picked a contrarian view to identify and support Francesco when others thought it impossible.\n\nFertility serves a similar use case on the importance of contingency planning. Birth rates are disturbingly lower than the replacement rate in many countries. For reference, there is no historical evidence of a civilization that has managed to recover from a negative rate meaning that all countries in the Western World and large parts of Asia including Japan are on a slow but inevitable trajectory towards disappearance. We understand that behaviors are the last to change, including at a time of crisis and we are thankfully able to appeal to science to provide a catalyst. When the world was talking pro-choice, we interpreted choice to include the ability to procreate in a way that fits with the working customs of this century's mothers. U-ploid Biotechnologies was born in 2023 with the mission of rejuvenating aged eggs and restoring the quality to that of a woman in her early twenties, demonstrating this in mice already, exhibiting its findings at the JPM Healthcare Conference earlier this year and securing partnerships with IVF clinics. We incorporated this company with Alexandre, who spent a decade researching egg behaviours at UCLA and Max Planck, and like Francesco after our BSF program, decided to renounce a career in academia to build his ideas in the real world. He attended our program, we supported him throughout the process, introduced him to Jordan, his now co-founder, a doctor, MBA Schwarzman Scholar and also a graduate from our program, signed the first check alongside a fertility specialist fund and currently supporting them with the ethics, market, and regulatory pathways. It helps that Annalisa, our venture partner, was on the science advisory board of the FDA for nearly a decade.\n\nTo drive the point home I could of course have referred to the use of science in defence, from robotics to cryptography, and the growing interest in our work from thinkers and stakeholders from DC to Brussels and Japan. Shelter and security are after all the first privilege discovered by human kind and science offers an unparalleled access to that. For this first Insight I feel that the energy and fertility instances above serve as a far brighter narrative and closer to what we feel the world should be prioritizing.\n\nAt this stage it's hard not to be tempted to blow smoke up our asses, we are clearly very proud of how our scientist founders perform and the sheer quality of what we're gearing up to deliver. We have proven that scientists can become the leaders of high-performance companies and through venture capital we are making the upside of their work accessible to private investors: those who have, are very happy with their decision to start investing in science. As a non-scientist I remember the privilege of being able to sit next to a scientist that was able to make me understand their work and I realize that besides returns, what we end up offering to those that align with our work is intelligence: the kind of insight that sits closest to prediction and that can shape multi-generational planning in these times.\n\nScientists First - Wilbe's mantra is based on our thesis that investing in science will have the most upside this century.",
    author: "Alessandro Philip Maiano",
    date: "2024-03-16",
    category: "Investment",
    featuredImage: "/lovable-uploads/960bb0ac-d3cd-40a0-845c-cc897c06b599.png",
    slug: "science-most-valuable-luxury-investing",
    readTime: 4,
    tags: ["investment", "science entrepreneurship", "venture capital", "deep tech", "fusion", "biotech"]
  },
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
  "Investment",
  "Science Entrepreneurship",
  "Funding",
  "Team Building",
  "IP & Legal",
  "Commercialization",
  "Mentorship",
  "Regulatory",
  "Data Analytics"
];
