
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LandingFooter() {
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

  const handleToolsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMediaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("🎬 Media hub coming soon! We're cooking up something special for you...", {
      duration: 4000,
    });
  };

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
                <button 
                  onClick={handleMediaClick}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  Media
                </button>
              </li>
              <li>
                <button 
                  onClick={handleToolsClick}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  Tools
                </button>
              </li>
              <li>
                <button 
                  onClick={handleCapitalClick}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  Capital
                </button>
              </li>
              <li>
                <button 
                  onClick={handleAboutClick}
                  className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <p className="text-gray-400 text-sm">69 Wilson Street</p>
            <p className="text-gray-400 text-sm">London, EC2A 2BB</p>
            <p className="text-gray-400 text-sm">Email: hello@wilbe.com</p>
            <p className="text-gray-400 text-sm">
          </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Subscribe to Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Stay up to date with the latest news, insights, and opportunities for scientist entrepreneurs.
            </p>
            <div className="flex">
              <input type="email" placeholder="Your email address" className="bg-gray-800 border border-gray-700 py-2 px-4 text-white focus:outline-none focus:border-green-500 text-sm" />
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
  );
}
