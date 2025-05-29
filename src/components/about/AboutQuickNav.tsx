
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Briefcase, ArrowRight } from "lucide-react";

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
        
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Button
            onClick={() => scrollToSection('opportunities-section')}
            className="h-auto p-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold text-lg">View Opportunities</div>
                <div className="text-sm text-blue-100">Jobs, volunteering & portfolio ventures</div>
              </div>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-auto" />
            </div>
          </Button>

          <Button
            onClick={() => scrollToSection('timeline-section')}
            className="h-auto p-6 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white border-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold text-lg">Our Story Timeline</div>
                <div className="text-sm text-gray-300">Journey from 2020 to today</div>
              </div>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-auto" />
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}
