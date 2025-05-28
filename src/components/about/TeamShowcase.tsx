
import { Badge } from "@/components/ui/badge"
import { Linkedin, Twitter, Mail } from "lucide-react"

export default function TeamShowcase() {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Co-Founder & CEO",
      expertise: "Biotech Entrepreneur",
      image: "/placeholder.svg",
      bio: "Former scientist turned entrepreneur with 3 successful biotech exits.",
      social: { linkedin: "#", twitter: "#", email: "sarah@wilbe.com" }
    },
    {
      name: "Prof. Michael Rodriguez",
      role: "Co-Founder & CTO",
      expertise: "Deep Tech Innovation",
      image: "/placeholder.svg",
      bio: "PhD in Materials Science, 15+ years building scientist communities.",
      social: { linkedin: "#", twitter: "#", email: "michael@wilbe.com" }
    },
    {
      name: "Dr. Aisha Patel",
      role: "Head of Capital",
      expertise: "Venture Investment",
      image: "/placeholder.svg",
      bio: "Former VC partner specializing in science-based startups.",
      social: { linkedin: "#", twitter: "#", email: "aisha@wilbe.com" }
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-white border-0 uppercase tracking-wide text-sm">
            Our Team
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Scientists Leading Scientists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our team combines deep scientific expertise with entrepreneurial experience, 
            creating a unique perspective on what scientist founders need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Team Photo Coming Soon</span>
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
