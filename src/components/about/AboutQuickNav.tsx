
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase, ArrowRight, Users, Share2 } from "lucide-react";

export default function AboutQuickNav() {
  console.log("AboutQuickNav component is rendering");
  
  const scrollToSection = (sectionId: string) => {
    console.log("Scrolling to section:", sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log("Element not found:", sectionId);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200" style={{ minHeight: '200px' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge className="mb-3 bg-gray-800 text-white border-0 uppercase tracking-wide text-sm">
            Quick Navigation
          </Badge>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Explore Our Story & Opportunities
          </h2>
          <p className="text-gray-600">
            Jump directly to what interests you most
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Button
            onClick={() => scrollToSection('team-section')}
            className="h-auto p-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex flex-col items-center gap-2 text-center min-h-0">
              <Users className="h-6 w-6 flex-shrink-0" />
              <div className="flex flex-col items-center w-full">
                <div className="font-semibold text-lg leading-tight whitespace-normal break-words">Meet the team</div>
                <div className="text-sm text-green-100 leading-tight mt-1 whitespace-normal break-words">Founders, team & advisors</div>
              </div>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </Button>

          <Button
            onClick={() => scrollToSection('opportunities-section')}
            className="h-auto p-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex flex-col items-center gap-2 text-center min-h-0">
              <Briefcase className="h-6 w-6 flex-shrink-0" />
              <div className="flex flex-col items-center w-full">
                <div className="font-semibold text-lg leading-tight whitespace-normal break-words">New opportunities</div>
                <div className="text-sm text-blue-100 leading-tight mt-1 whitespace-normal break-words">Jobs, volunteering & portfolio ventures</div>
              </div>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </Button>

          <Button
            onClick={() => scrollToSection('timeline-section')}
            className="h-auto p-6 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex flex-col items-center gap-2 text-center min-h-0">
              <Calendar className="h-6 w-6 flex-shrink-0" />
              <div className="flex flex-col items-center w-full">
                <div className="font-semibold text-lg leading-tight whitespace-normal break-words">Our story</div>
                <div className="text-sm text-gray-300 leading-tight mt-1 whitespace-normal break-words">Journey from 2020 to today</div>
              </div>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </Button>

          <Button
            onClick={() => scrollToSection('social-media-section')}
            className="h-auto p-6 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex flex-col items-center gap-2 text-center min-h-0">
              <Share2 className="h-6 w-6 flex-shrink-0" />
              <div className="flex flex-col items-center w-full">
                <div className="font-semibold text-lg leading-tight whitespace-normal break-words">Follow the adventures</div>
                <div className="text-sm text-pink-100 leading-tight mt-1 whitespace-normal break-words">Connect & follow our journey</div>
              </div>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}
