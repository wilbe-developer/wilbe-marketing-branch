
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Quote, Star, Users, Building2, Globe } from "lucide-react"

export default function CommunityImpact() {
  const testimonials = [
    {
      quote: "Wilbe transformed how I thought about turning my research into a business. The community support was incredible.",
      author: "Dr. Maria Gonzalez",
      role: "Founder, BioInnovate",
      avatar: "/placeholder.svg"
    },
    {
      quote: "The roadshow visit to our university opened doors I didn't even know existed. Amazing network and resources.",
      author: "Prof. James Liu",
      role: "MIT Materials Science",
      avatar: "/placeholder.svg"
    },
    {
      quote: "From BSF program to securing funding - Wilbe was with us every step of our entrepreneurial journey.",
      author: "Dr. Sarah Ahmed",
      role: "CEO, CleanTech Solutions",
      avatar: "/placeholder.svg"
    }
  ]

  const impactStats = [
    { icon: Users, number: "2,500+", label: "Scientist Members", description: "Active entrepreneur community" },
    { icon: Building2, number: "150+", label: "Companies Launched", description: "Through our programs" },
    { icon: Globe, number: "25", label: "Countries Reached", description: "Global scientist network" },
    { icon: Star, number: "$250M+", label: "Funding Raised", description: "By our community companies" }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-white border-0 uppercase tracking-wide text-sm">
            Our Impact
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Transforming Science Into Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Since 2020, we've helped thousands of scientists turn their research into thriving companies. 
            Here's the impact we've made together.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {impactStats.map((stat, index) => (
            <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="font-medium text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12 uppercase tracking-wide">
            What Scientists Say
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <Quote className="h-8 w-8 text-gray-400 mb-4" />
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Photo</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-black text-white p-12 rounded-lg text-center">
          <h3 className="text-3xl font-bold mb-4 uppercase tracking-wide">
            Ready to Join Our Community?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're a researcher with an idea or a scientist entrepreneur scaling your company, 
            Wilbe is here to support your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-bold uppercase tracking-wide px-8 py-3"
            >
              Join the Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-wide px-8 py-3"
            >
              Learn About BSF
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
