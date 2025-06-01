
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import { Link } from "react-router-dom"
import WilbeLogo from "@/assets/WilbeLogo"
import SearchModal from "@/components/common/SearchModal"

export default function LandingNavigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const scientistsSection = document.getElementById('scientists-first');
    if (scientistsSection) {
      scientistsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCapitalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const capitalSection = document.getElementById('wilbe-capital');
    if (capitalSection) {
      capitalSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
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
                <Link to="/media" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                  Media
                </Link>
                <Link to="/tools" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                  Tools
                </Link>
                <button 
                  onClick={handleCapitalClick}
                  className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide cursor-pointer"
                >
                  Capital
                </button>
                <button 
                  onClick={handleAboutClick}
                  className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide cursor-pointer"
                >
                  About
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://app.wilbe.com" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-sm font-bold uppercase tracking-wide px-6 py-2"
                >
                  Scientist Log In
                </Button>
              </a>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-900" />
              </button>
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
