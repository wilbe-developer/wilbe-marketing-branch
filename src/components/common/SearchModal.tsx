
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Video, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'video' | 'member' | 'event' | 'content';
  description: string;
  url: string;
  icon: React.ComponentType<any>;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search data - in a real app, this would come from your backend
  const mockData: SearchResult[] = [
    {
      id: "1",
      title: "Building Your Pitch Deck",
      type: "video",
      description: "Learn how to create compelling pitch decks for investors",
      url: "/video-player?id=1",
      icon: Video
    },
    {
      id: "2", 
      title: "Dr. Sarah Chen",
      type: "member",
      description: "Biotech entrepreneur and researcher",
      url: "/member-directory",
      icon: Users
    },
    {
      id: "3",
      title: "Breakthrough to Scientist Founder",
      type: "content",
      description: "Our flagship program for scientist entrepreneurs",
      url: "/landing-page#tools-section",
      icon: FileText
    },
    {
      id: "4",
      title: "Virtual Networking Event",
      type: "event", 
      description: "Connect with fellow scientist entrepreneurs",
      url: "/events",
      icon: Calendar
    }
  ];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  const handleResultClick = () => {
    onClose();
    setQuery("");
    setResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Wilbe
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for videos, members, events, and more..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {isSearching && (
            <div className="text-center py-8 text-gray-500">
              Searching...
            </div>
          )}

          {!isSearching && query && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <Link
                  key={result.id}
                  to={result.url}
                  onClick={handleResultClick}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                >
                  <div className="flex items-start gap-3">
                    <result.icon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {result.description}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mt-1 capitalize">
                        {result.type}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Link
                  to="/landing-page#tools-section"
                  onClick={handleResultClick}
                  className="p-3 rounded-lg hover:bg-gray-50 transition-colors border text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Our Tools</span>
                  </div>
                </Link>
                <Link
                  to="/media"
                  onClick={handleResultClick}
                  className="p-3 rounded-lg hover:bg-gray-50 transition-colors border text-left"
                >
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Media Hub</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
