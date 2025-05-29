import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter, Mail } from "lucide-react";
export default function TeamShowcase() {
  const founders = [{
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
  }, {
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
  }];
  const teamMembers = [{
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
  }, {
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
  }, {
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
  }, {
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
  }];
  return <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Founders Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-white border-0 uppercase tracking-wide text-sm">
            Our Founders
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">SCIENTISTS AND OPERATORS TO DEFINE A NEW MEANING OF SCIENCE</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our founding team combines deep scientific expertise with entrepreneurial experience, 
            creating a unique perspective on what scientist founders need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {founders.map((member, index) => <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
              <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" style={{
              objectPosition: index === 0 ? '25% 20%' : '75% 20%'
            }} />
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
            </div>)}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-56 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" style={{
              objectPosition: index === 0 ? '50% 30%' : index === 1 ? '50% 20%' : index === 2 ? '50% 25%' : '50% 30%'
            }} />
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
            </div>)}
        </div>
      </div>
    </section>;
}