
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import { Link } from "react-router-dom"
import WilbeLogo from "@/assets/WilbeLogo"

export default function LandingNavigation() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Menu className="h-6 w-6 md:hidden" />
            <Link to="/" className="flex items-center">
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
              <Link to="/terminal" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Terminal
              </Link>
              <Link to="/capital" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Capital
              </Link>
              <Link to="/labs" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Labs
              </Link>
              <Link to="/advocacy" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Advocacy
              </Link>
              <Link to="/merch" className="text-gray-900 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Merch
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-sm font-bold uppercase tracking-wide px-6 py-2"
            >
              Scientists Log In
            </Button>
            <Search className="h-5 w-5 text-gray-900" />
          </div>
        </div>
      </div>
    </nav>
  )
}
