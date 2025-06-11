import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import MediaComingSoonDialog from "@/components/common/MediaComingSoonDialog";
import { useNewsletterSubscription } from "@/hooks/useNewsletterSubscription";

export default function LandingFooter() {
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { subscribe, isLoading, isSuccess } = useNewsletterSubscription();

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
    setIsMediaDialogOpen(true);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await subscribe(email);
    if (success) {
      setEmail("");
    }
  };

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <div className="flex items-center gap-4 mb-4">
                <a href="https://linkedin.com/company/wilbe" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://x.com/wilbe_science" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
                <a href="https://youtube.com/@wilbescience" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
              <div className="text-xs text-gray-400">
                #ScientistsFirst
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Subscribe to Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">
                Stay up to date with the latest news, insights, and opportunities for scientist entrepreneurs.
              </p>
              
              {isSuccess ? (
                <div className="flex items-center gap-2 p-4 bg-green-900/30 border border-green-700 rounded text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Successfully subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border border-gray-700 py-2 px-4 text-white focus:outline-none focus:border-green-500 text-sm"
                    required
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className="bg-green-500 hover:bg-green-600 text-black text-sm font-bold uppercase tracking-wide w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-center text-sm">
              © 2025 Wilbe. All rights reserved. |{" "}
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

      <MediaComingSoonDialog
        isOpen={isMediaDialogOpen}
        onClose={() => setIsMediaDialogOpen(false)}
      />
    </>
  );
}
