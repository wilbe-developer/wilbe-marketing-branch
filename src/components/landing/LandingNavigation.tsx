
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, Search, X } from "lucide-react"
import { Link } from "react-router-dom"
import WilbeLogo from "@/assets/WilbeLogo"
import SearchModal from "@/components/common/SearchModal"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function LandingNavigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const scientistsSection = document.getElementById('scientists-first');
    if (scientistsSection) {
      scientistsSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleCapitalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const capitalSection = document.getElementById('wilbe-capital');
    if (capitalSection) {
      capitalSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleToolsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              {/* Mobile Menu Trigger */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden min-h-[44px] min-w-[44px]">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="flex flex-col h-full bg-white">
                    <div className="p-6 border-b border-gray-200">
                      <Link to="/landing-page" onClick={() => setIsMobileMenuOpen(false)}>
                        <WilbeLogo
                          className="h-8 w-auto"
                          style={{
                            '--sails-color': 'black',
                            '--text-color': 'black',
                          } as React.CSSProperties}
                        />
                      </Link>
                    </div>
                    <nav className="flex-1 p-6">
                      <div className="space-y-4">
                        <Link 
                          to="/media" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 px-4 text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] flex items-center"
                        >
                          Media
                        </Link>
                        <button 
                          onClick={handleToolsClick}
                          className="block w-full text-left py-3 px-4 text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px]"
                        >
                          Tools
                        </button>
                        <button 
                          onClick={handleCapitalClick}
                          className="block w-full text-left py-3 px-4 text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px]"
                        >
                          Capital
                        </button>
                        <button 
                          onClick={handleAboutClick}
                          className="block w-full text-left py-3 px-4 text-lg font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px]"
                        >
                          About
                        </button>
                      </div>
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <a 
                          href="https://app.wilbe.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full bg-gray-900 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors min-h-[44px] flex items-center justify-center"
                        >
                          Scientist Log In
                        </a>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

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
                <button 
                  onClick={handleToolsClick}
                  className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide cursor-pointer"
                >
                  Tools
                </button>
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a href="https://app.wilbe.com" target="_blank" rel="noopener noreferrer" className="hidden sm:block">
                <Button
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-sm font-bold uppercase tracking-wide px-4 sm:px-6 py-2 min-h-[44px]"
                >
                  Scientist Log In
                </Button>
              </a>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
