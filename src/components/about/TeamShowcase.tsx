import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter, Mail, ArrowRight, Users, Building, Briefcase } from "lucide-react";

export default function TeamShowcase() {
  const founders = [
    {
      name: "Ale Maiano",
      role: "CEO & Co-Founder",
      expertise: "Deep Tech Leadership",
      image: "/lovable-uploads/00943097-b362-4bca-8b93-6e3a0cc3d76f.png",
      bio: "CEO at Wilbe, started in policy, trained as a corporate attorney to then lead operations at multiple deep tech ventures. Rage Against The Machine for breakfast.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ale@wilbe.com"
      }
    },
    {
      name: "Devika Thapar",
      role: "COO & Co-Founder",
      expertise: "Technology Commercialization",
      image: "/lovable-uploads/00943097-b362-4bca-8b93-6e3a0cc3d76f.png",
      bio: "COO at Wilbe. Dee has been commercializing frontier technologies first as new product development lead at IBM Watson and before in tech transfer at Yale. She began her career at Accenture and serves on the board of several organizations, promoting STEM through dance.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "devika@wilbe.com"
      }
    }
  ];

  const teamMembers = [
    {
      name: "Ali Farzanehfar, PhD",
      role: "Founder Advocate",
      expertise: "Science Entrepreneurship",
      image: "/lovable-uploads/798d9aa7-0159-46b6-8731-52abf7af74b8.png",
      bio: "Founder Advocate at Wilbe, Ali supports scientist founders throughout their journey from scientist to founder. He's an ex-CERN physicist who strayed off the path as management consultant, but is now back with the good guys.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "ali@wilbe.com"
      }
    },
    {
      name: "Anna Vildaus",
      role: "Operations Lead",
      expertise: "Marketing & Operations",
      image: "/lovable-uploads/798d9aa7-0159-46b6-8731-52abf7af74b8.png",
      bio: "Operations Lead at Wilbe, Anna brings a diverse background in marketing and branding across various industries and non-profits. Most recently, she co-founded and led operations at a medtech startup focused on improving stroke care.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "anna@wilbe.com"
      }
    },
    {
      name: "Jesse Zondervan, PhD",
      role: "Associate (Platform & Systems)",
      expertise: "Technical Infrastructure",
      image: "/lovable-uploads/798d9aa7-0159-46b6-8731-52abf7af74b8.png",
      bio: "Associate (Platform & Systems) at Wilbe, Jesse brings a hacker's mindset and a healthy disregard for how things are \"supposed\" to work. He builds the infrastructure and behind-the-scenes machinery that keeps us scaling, iterating, and occasionally breaking things (on purpose). Ex-Oxford Earth scientist. Still fond of a good terraforming experiment.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "jesse@wilbe.com"
      }
    },
    {
      name: "Fabrizio Nicola-Giordano",
      role: "CEO at WilbeLab",
      expertise: "Lab Operations",
      image: "/lovable-uploads/798d9aa7-0159-46b6-8731-52abf7af74b8.png",
      bio: "CEO at WilbeLab, Fabri supports scientist founders in setting up lab spaces. Formerly at Headspace Group, which he grew until acquisition. You can catch Fabri surfing and exploring culinary and health interests.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "fabri@wilbe.com"
      }
    },
    {
      name: "[Team Member Name]",
      role: "[Role Title]",
      expertise: "[Area of Expertise]",
      image: "/placeholder.svg",
      bio: "[Bio description to be added - highlighting their background, experience, and contribution to Wilbe's mission.]",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "[email]@wilbe.com"
      }
    },
    {
      name: "[Team Member Name]",
      role: "[Role Title]",
      expertise: "[Area of Expertise]",
      image: "/placeholder.svg",
      bio: "[Bio description to be added - highlighting their background, experience, and contribution to Wilbe's mission.]",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "[email]@wilbe.com"
      }
    },
    {
      name: "[Team Member Name]",
      role: "[Role Title]",
      expertise: "[Area of Expertise]",
      image: "/placeholder.svg",
      bio: "[Bio description to be added - highlighting their background, experience, and contribution to Wilbe's mission.]",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "[email]@wilbe.com"
      }
    }
  ];

  const venturePartnersAndAdvisors = [
    {
      name: "[Venture Partner Name]",
      role: "Venture Partner",
      expertise: "[Investment Focus/Expertise]",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop",
      bio: "[Bio description highlighting their investment background, portfolio companies, and how they support Wilbe's mission in advancing scientist entrepreneurship.]",
      company: "[Current Firm/Organization]",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "[email]@example.com"
      }
    },
    {
      name: "[Strategic Advisor Name]",
      role: "Strategic Advisor",
      expertise: "[Strategic Area]",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop",
      bio: "[Bio description highlighting their strategic expertise, industry experience, and advisory contributions to scientist founders.]",
      company: "[Current Role/Company]",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "[email]@example.com"
      }
    },
    {
      name: "[Industry Advisor Name]",
      role: "Industry Advisor",
      expertise: "[Industry Specialization]",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop",
      bio: "[Bio description highlighting their industry leadership, domain expertise, and mentorship of deep tech entrepreneurs.]",
      company: "[Current Position]",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "[email]@example.com"
      }
    },
    {
      name: "[Technical Advisor Name]",
      role: "Technical Advisor",
      expertise: "[Technical Domain]",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop",
      bio: "[Bio description highlighting their technical expertise, research background, and guidance for technology commercialization.]",
      company: "[Academic/Industry Position]",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "[email]@example.com"
      }
    }
  ];

  const previousMembers = [
    {
      name: "Dr. Sarah Chen",
      previousRole: "Senior Research Associate",
      currentPosition: "VP of Research",
      currentCompany: "BioGenTech Solutions",
      tenure: "2021-2023",
      image: "/placeholder.svg",
      contribution: "Led platform development for early-stage biotech companies",
      currentFocus: "Scaling research operations for Series B biotech startups",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah.chen@example.com"
      }
    },
    {
      name: "Michael Rodriguez, PhD",
      previousRole: "Community Manager",
      currentPosition: "Co-Founder & CEO",
      currentCompany: "CleanEarth Innovations",
      tenure: "2020-2022",
      image: "/placeholder.svg",
      contribution: "Built our scientist entrepreneur community from 100 to 1,500+ members",
      currentFocus: "Developing carbon capture technologies for industrial applications",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "m.rodriguez@example.com"
      }
    },
    {
      name: "Dr. Emma Thompson",
      previousRole: "Technical Lead",
      currentPosition: "Principal Scientist",
      currentCompany: "Moderna",
      tenure: "2021-2024",
      image: "/placeholder.svg",
      contribution: "Designed technical infrastructure supporting 500+ scientist projects",
      currentFocus: "Leading next-generation vaccine development programs",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "e.thompson@example.com"
      }
    }
  ];

  const alumniStats = [
    {
      metric: "15+",
      label: "Alumni Network",
      description: "Former team members making impact across the ecosystem"
    },
    {
      metric: "8",
      label: "Companies Founded",
      description: "Startups launched by Wilbe alumni"
    },
    {
      metric: "$50M+",
      label: "Capital Raised",
      description: "Total funding secured by alumni ventures"
    },
    {
      metric: "12",
      label: "Leadership Roles",
      description: "VP+ positions at major organizations"
    }
  ];

  const opportunityCards = [
    {
      title: "Join Wilbe",
      icon: Building,
      description: "Be part of our mission to support scientist entrepreneurs",
      details: "We're always looking for passionate individuals who share our vision of advancing scientific innovation.",
      cta: "View Open Positions",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Scientists First Movement",
      icon: Users,
      description: "Volunteer to advance scientist entrepreneurship globally",
      details: "Help build the infrastructure that scientist founders need to succeed through volunteer opportunities.",
      cta: "Become a Volunteer",
      gradient: "from-green-600 to-blue-600"
    },
    {
      title: "Portfolio Ventures",
      icon: Briefcase,
      description: "Explore opportunities at our portfolio companies",
      details: "Join innovative startups that are solving humanity's biggest challenges through scientific breakthroughs.",
      cta: "Explore Opportunities",
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Founders Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-white border-0 uppercase tracking-wide text-sm">
            Our Founders
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            SCIENTISTS AND OPERATORS TO DEFINE A NEW MEANING OF SCIENCE
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our founding team combines deep scientific expertise with entrepreneurial experience, 
            creating a unique perspective on what scientist founders need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {founders.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
              <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                  style={{
                    objectPosition: index === 0 ? '25% 20%' : '75% 20%'
                  }} 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600 font-medium mb-2">{member.role}</p>
                <Badge className="mb-3 bg-gray-100 text-gray-700 border-0">
                  {member.expertise}
                </Badge>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex space-x-3">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Members Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gray-800 text-white border-0 uppercase tracking-wide text-sm">
            Our Team
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            The People Behind Wilbe
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated team working every day to support scientist entrepreneurs 
            in their journey from lab to market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-56 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                  style={{
                    objectPosition: index === 0 ? '50% 30%' : index === 1 ? '50% 20%' : index === 2 ? '50% 25%' : '50% 30%'
                  }} 
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600 font-medium mb-2 text-sm">{member.role}</p>
                <Badge className="mb-3 bg-gray-100 text-gray-700 border-0 text-xs">
                  {member.expertise}
                </Badge>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                <div className="flex space-x-3">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Venture Partners and Advisors Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 uppercase tracking-wide text-sm">
            Venture Partners & Advisors
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Strategic Partners & Industry Leaders
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our venture partners and advisors bring decades of experience in deep tech investing, 
            industry expertise, and strategic guidance to support our scientist founders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {venturePartnersAndAdvisors.map((advisor, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={advisor.image} 
                  alt={advisor.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 bg-white/90 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                  {advisor.role}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{advisor.name}</h3>
                <p className="text-blue-600 font-medium mb-1 text-sm">{advisor.company}</p>
                <Badge className="mb-3 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  {advisor.expertise}
                </Badge>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4">{advisor.bio}</p>
                <div className="flex space-x-3">
                  <a href={advisor.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href={advisor.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href={`mailto:${advisor.social.email}`} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alumni Network & Opportunities Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white border-0 uppercase tracking-wide text-sm">
            Alumni Network & Opportunities
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Where Wilbe Alumni Go Next
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our former team members continue to advance scientific entrepreneurship across the ecosystem. 
            Join our mission or explore opportunities in our growing network.
          </p>
        </div>

        {/* Alumni Stats */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          {alumniStats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.metric}</div>
              <div className="text-gray-600 font-medium mb-2 uppercase tracking-wide text-sm">{stat.label}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Opportunity Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {opportunityCards.map((opportunity, index) => {
            const IconComponent = opportunity.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`h-32 bg-gradient-to-r ${opportunity.gradient} flex items-center justify-center relative`}>
                  <IconComponent className="h-12 w-12 text-white" />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{opportunity.title}</h3>
                  <p className="text-gray-700 font-medium mb-3">{opportunity.description}</p>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{opportunity.details}</p>
                  
                  <button className={`w-full bg-gradient-to-r ${opportunity.gradient} text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group`}>
                    {opportunity.cta}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-gray-900 to-black rounded-lg text-white">
          <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide">
            Ready to Make an Impact?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're looking to join our team, volunteer for the Scientists First movement, 
            or explore opportunities at our portfolio companies, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
