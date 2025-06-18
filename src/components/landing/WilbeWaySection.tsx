
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Target, DollarSign, Zap, GraduationCap } from "lucide-react";

export default function WilbeWaySection() {
  return (
    <section id="wilbe-way" className="py-20 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide mb-6">
            THE WILBE WAY: OUR CORE BELIEFS FOR SUCCESSFUL SCIENCE VENTURES
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
            Based on our experience as operators and building companies in Fund 1, we've identified the essential 
            elements for transforming breakthrough science into successful ventures. These are the core activities 
            we help every scientist deliver through our proven process.
          </p>
        </div>

        {/* Core Beliefs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Belief 1 */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Full-Time Commitment</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Scientists must work on the company full-time to drive breakthrough success and maintain competitive advantage.
            </p>
          </div>

          {/* Belief 2 */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">No Lab Juggling</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Principal Investigators cannot successfully juggle academic labs while building ventures. Focus is essential.
            </p>
          </div>

          {/* Belief 3 */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Economic Validation First</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Stop focusing on papers and publications. Validate the economic opportunity and market potential instead.
            </p>
          </div>

          {/* Belief 4 */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cap Table Control</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Maintain control of your cap table. Non-full-time PIs and TTOs should hold single-digit equity percentages.
            </p>
          </div>

          {/* Belief 5 */}
          <div className="text-center lg:col-span-1 md:col-span-2 lg:col-start-2">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Profound Sense of Urgency</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Being a founder is not a career plan change but an unexplainable impulse driven by urgent purpose.
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
