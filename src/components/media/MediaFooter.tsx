
import { Link } from "react-router-dom"
import WilbeLogo from "@/assets/WilbeLogo"

export default function MediaFooter() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/landing-page" className="flex items-center mb-4">
              <WilbeLogo
                className="h-8 w-auto"
                style={{
                  '--sails-color': 'white',
                  '--text-color': 'white',
                } as React.CSSProperties}
              />
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering scientist-led companies to transform breakthrough research into scalable businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4">Content</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/media#videos" className="hover:text-white transition-colors">Videos</Link></li>
              <li><Link to="/media#podcasts" className="hover:text-white transition-colors">Podcasts</Link></li>
              <li><Link to="/media#social" className="hover:text-white transition-colors">Social Media</Link></li>
              <li><Link to="/media#gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Wilbe. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
