
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">About Wilbe</h4>
            <p className="text-gray-400 text-sm">
              Wilbe is the home for entrepreneurial scientists. We connect scientist founders with market
              intelligence, exclusive insights, venture tools, founders community, lab space and capital—all in one
              place.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Media
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terminal
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Capital
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Labs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Advocacy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Merch
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <p className="text-gray-400 text-sm">123 Science Street</p>
            <p className="text-gray-400 text-sm">Science City, CA 91234</p>
            <p className="text-gray-400 text-sm">Email: info@wilbe.com</p>
            <p className="text-gray-400 text-sm">Phone: (123) 456-7890</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Subscribe to Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Stay up to date with the latest news, insights, and opportunities for scientist entrepreneurs.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border border-gray-700 py-2 px-4 text-white focus:outline-none focus:border-green-500 text-sm"
              />
              <Button className="bg-green-500 hover:bg-green-600 text-black text-sm font-bold uppercase tracking-wide">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6">
          <p className="text-gray-500 text-center text-sm">
            © 2024 Wilbe. All rights reserved. |{" "}
            <Link to="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>{" "}
            |{" "}
            <Link to="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
