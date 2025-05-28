
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

export default function LandingNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/lovable-uploads/wilbeLogoNewPng.png"
                alt="Wilbe"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/knowledge-center"
                className="text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Knowledge Center
              </Link>
              <Link
                to="/video"
                className="text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Video Library
              </Link>
              <Link
                to="/member-directory"
                className="text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Member Directory
              </Link>
              <Link
                to="/bsf"
                className="text-gray-900 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Breakthrough: Framing your journey and connecting with peers
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-bold">
              Join Community
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/knowledge-center"
              className="text-gray-900 hover:text-green-600 block px-3 py-2 text-base font-medium"
            >
              Knowledge Center
            </Link>
            <Link
              to="/video"
              className="text-gray-900 hover:text-green-600 block px-3 py-2 text-base font-medium"
            >
              Video Library
            </Link>
            <Link
              to="/member-directory"
              className="text-gray-900 hover:text-green-600 block px-3 py-2 text-base font-medium"
            >
              Member Directory
            </Link>
            <Link
              to="/bsf"
              className="text-gray-900 hover:text-green-600 block px-3 py-2 text-base font-medium"
            >
              Breakthrough: Framing your journey and connecting with peers
            </Link>
            <div className="px-3 py-2">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
