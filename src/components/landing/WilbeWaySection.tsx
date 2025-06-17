
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Lightbulb, Rocket } from "lucide-react";

export default function WilbeWaySection() {
  return (
    <section id="wilbe-way" className="py-20 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide mb-6">
            THE WILBE WAY: OUR PROVEN METHODOLOGY
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
            Every successful founder in our portfolio has followed the same proven playbook. The Wilbe Way combines 
            rigorous scientific validation with venture building expertise, giving scientist-founders the knowledge, 
            tools, and community support needed to transform breakthrough research into scalable businesses.
          </p>
        </div>

        {/* Methodology Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Pillar 1 */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Science-First Validation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Rigorous validation of scientific breakthroughs before business development, ensuring solid foundations for venture success.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Knowledge + Tools Access</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Comprehensive knowledge center and practical tools for venture building, from ideation to market entry.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Venture Building Process</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Structured sprint methodology guiding founders through key milestones from concept to investable company.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Community-Driven Support</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Access to a global network of scientist-entrepreneurs, mentors, and domain experts for ongoing guidance.
            </p>
          </div>
        </div>

        {/* Process Flow */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            From Research to Revenue: The Proven Path
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center flex-1">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-600">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Scientific Discovery</p>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 transform md:transform-none rotate-90 md:rotate-0" />
            <div className="text-center flex-1">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-600">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Validation & Planning</p>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 transform md:transform-none rotate-90 md:rotate-0" />
            <div className="text-center flex-1">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-600">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Sprint Execution</p>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 transform md:transform-none rotate-90 md:rotate-0" />
            <div className="text-center flex-1">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-600">
                <span className="text-red-600 font-bold">4</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Investment & Scale</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
          <a href="/dashboard">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3 rounded-none w-full md:w-auto">
              <span className="flex items-center justify-center">
                ACCESS THE TOOLS
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
          </a>
          <a href="/wilbeway">
            <Button variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-medium px-8 py-3 rounded-none w-full md:w-auto">
              <span className="flex items-center justify-center">
                LEARN THE METHODOLOGY
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
