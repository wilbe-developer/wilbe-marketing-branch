
import { Badge } from "@/components/ui/badge"
import { Linkedin, Twitter, Mail } from "lucide-react"

export default function TeamShowcase() {
  const teamMembers = [
    {
      name: "Ale Maiano",
      role: "CEO & Co-Founder",
      expertise: "Deep Tech Leadership",
      image: "/lovable-uploads/00943097-b362-4bca-8b93-6e3a0cc3d76f.png",
      bio: "CEO at Wilbe, started in policy, trained as a corporate attorney to then lead operations at multiple deep tech ventures. Rage Against The Machine for breakfast.",
      social: { linkedin: "#", twitter: "#", email: "ale@wilbe.com" }
    },
    {
      name: "Devika Thapar",
      role: "COO & Co-Founder",
      expertise: "Technology Commercialization",
      image: "/lovable-uploads/00943097-b362-4bca-8b93-6e3a0cc3d76f.png",
      bio: "COO at Wilbe. Dee has been commercializing frontier technologies first as new product development lead at IBM Watson and before in tech transfer at Yale. She began her career at Accenture and serves on the board of several organizations, promoting STEM through dance.",
      social: { linkedin: "#", twitter: "#", email: "devika@wilbe.com" }
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-white border-0 uppercase tracking-wide text-sm">
            Our Founders
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Scientists Leading Scientists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our founding team combines deep scientific expertise with entrepreneurial experience, 
            creating a unique perspective on what scientist founders need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
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
      </div>
    </section>
  )
}
