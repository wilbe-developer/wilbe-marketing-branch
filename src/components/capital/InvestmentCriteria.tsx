
import { Target, Globe, FileText, Lightbulb } from "lucide-react";

export default function InvestmentCriteria() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Investment Criteria Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Stage */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Stage</h4>
            <p className="text-gray-600 text-sm">We are typically the first check, half of the scientists we backed did not have foundational IP</p>
          </div>

          {/* Sectors */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Sectors</h4>
            <p className="text-gray-600 text-sm">All scientific applications from fusion to fertility therapeutics</p>
          </div>

          {/* Region */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Region</h4>
            <p className="text-gray-600 text-sm">Science knows no border, we have invested across all of US, Europe and even in India</p>
          </div>

          {/* Wilbe Way */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Wilbe Way</h4>
            <p className="text-gray-600 text-sm">All the scientists became founders through our support process</p>
          </div>
        </div>
      </div>
    </section>
  )
}
