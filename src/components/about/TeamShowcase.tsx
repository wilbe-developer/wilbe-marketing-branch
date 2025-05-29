
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";

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

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
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

        {/* Previous Team Members Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white border-0 uppercase tracking-wide text-sm">
            Alumni Network
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Previous Team Members
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our former team members continue to make impact in the scientific entrepreneurship ecosystem. 
            Once part of Wilbe, always part of the mission.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {previousMembers.map((member, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                  {member.tenure}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                
                {/* Previous Role */}
                <div className="mb-2">
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Previous Role at Wilbe</p>
                  <p className="text-gray-700 font-medium text-sm">{member.previousRole}</p>
                </div>

                {/* Current Position */}
                <div className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Currently</p>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{member.currentPosition}</p>
                  <p className="text-gray-600 text-sm">{member.currentCompany}</p>
                </div>

                {/* Contribution & Current Focus */}
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Contribution</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{member.contribution}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Current Focus</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{member.currentFocus}</p>
                  </div>
                </div>

                {/* Social Links */}
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

        {/* Alumni Network CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            The Wilbe Alumni Network
          </h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Our former team members represent the impact of our mission beyond our walls. 
            They continue to advance science entrepreneurship in leadership roles across the ecosystem.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">15+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wide">Alumni Network</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
              <div className="text-gray-600 text-sm uppercase tracking-wide">Companies Founded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$50M+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wide">Capital Raised</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
