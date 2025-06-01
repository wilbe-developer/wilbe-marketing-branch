
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Menu } from "lucide-react"
import { Link } from "react-router-dom"
import WilbeLogo from "@/assets/WilbeLogo"
import SearchModal from "@/components/common/SearchModal"

export default function MediaNavigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/landing-page" className="flex items-center">
                <WilbeLogo
                  className="h-8 w-auto"
                  style={{
                    '--sails-color': 'black',
                    '--text-color': 'black',
                  } as React.CSSProperties}
                />
              </Link>
              <div className="hidden md:flex space-x-8 text-sm font-medium">
                <Link to="/media#videos" className="text-gray-900 hover:text-red-600 transition-colors">
                  Video
                </Link>
                <Link to="/media#podcasts" className="text-gray-900 hover:text-red-600 transition-colors">
                  Podcasts
                </Link>
                <Link to="/media#news" className="text-gray-900 hover:text-red-600 transition-colors">
                  Industry News
                </Link>
                <Link to="/media#social" className="text-gray-900 hover:text-red-600 transition-colors">
                  Social
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </button>
              <Button
                variant="outline"
                className="border border-gray-300 text-gray-900 hover:bg-gray-50 text-sm font-medium px-4 py-2"
              >
                Subscribe
              </Button>
              <Menu className="h-6 w-6 md:hidden text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}
