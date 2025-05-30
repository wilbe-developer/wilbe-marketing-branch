
import { Button } from "@/components/ui/button"
import { Search, Menu } from "lucide-react"
import { Link } from "react-router-dom"
import WilbeLogo from "@/assets/WilbeLogo"

export default function MediaNavigation() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Menu className="h-6 w-6 md:hidden" />
            <Link to="/landing-page" className="flex items-center">
              <WilbeLogo
                className="h-6 w-auto"
                style={{
                  '--sails-color': 'black',
                  '--text-color': 'black',
                } as React.CSSProperties}
              />
            </Link>
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <Link to="/media#videos" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Videos
              </Link>
              <Link to="/media#podcasts" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Podcasts
              </Link>
              <Link to="/media#social" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Social
              </Link>
              <Link to="/media#gallery" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Gallery
              </Link>
              <Link to="/media#news" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Industry News
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-sm font-bold uppercase tracking-wide px-6 py-2"
            >
              Subscribe
            </Button>
            <Search className="h-5 w-5 text-gray-900" />
          </div>
        </div>
      </div>
    </nav>
  )
}
