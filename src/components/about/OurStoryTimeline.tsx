
import { Badge } from "@/components/ui/badge"
import { Calendar, Rocket, Users, TrendingUp } from "lucide-react"

export default function OurStoryTimeline() {
  // Placeholder structure - you can provide the actual dates and milestones later
  const timelineData = [
    {
      year: "2020",
      milestones: [
        { date: "TBD", title: "Company Founded", description: "Milestone details to be provided", icon: Rocket },
        { date: "TBD", title: "First Community Event", description: "Details coming soon", icon: Users }
      ]
    },
    {
      year: "2021",
      milestones: [
        { date: "TBD", title: "Platform Launch", description: "Milestone details to be provided", icon: TrendingUp },
        { date: "TBD", title: "Key Partnership", description: "Details coming soon", icon: Users }
      ]
    },
    {
      year: "2022",
      milestones: [
        { date: "TBD", title: "Major Milestone", description: "Milestone details to be provided", icon: Rocket },
        { date: "TBD", title: "Growth Achievement", description: "Details coming soon", icon: TrendingUp }
      ]
    },
    {
      year: "2023",
      milestones: [
        { date: "TBD", title: "Expansion", description: "Milestone details to be provided", icon: Users },
        { date: "TBD", title: "New Initiative", description: "Details coming soon", icon: Rocket }
      ]
    },
    {
      year: "2024",
      milestones: [
        { date: "TBD", title: "Recent Achievement", description: "Milestone details to be provided", icon: TrendingUp },
        { date: "TBD", title: "Current Focus", description: "Details coming soon", icon: Users }
      ]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-white border-0 uppercase tracking-wide text-sm">
            Our Journey
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Our Story Timeline
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From 2020 to today, here's how we've grown from an idea to a global community 
            of scientist entrepreneurs. <em className="text-gray-500">(Specific dates and milestones to be added)</em>
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300"></div>

          {timelineData.map((yearData, yearIndex) => (
            <div key={yearData.year} className="mb-16">
              {/* Year marker */}
              <div className="relative flex justify-center mb-8">
                <div className="bg-black text-white px-6 py-3 rounded-full font-bold text-xl uppercase tracking-wide">
                  {yearData.year}
                </div>
              </div>

              {/* Milestones for this year */}
              {yearData.milestones.map((milestone, milestoneIndex) => (
                <div key={milestoneIndex} className={`relative flex items-center mb-8 ${milestoneIndex % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${milestoneIndex % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <milestone.icon className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-500 font-medium">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {milestone.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600 italic">
            📅 Timeline dates and milestone details will be added when you provide them. 
            The structure is ready to accommodate multiple milestones per year with rich descriptions and visual elements.
          </p>
        </div>
      </div>
    </section>
  )
}
