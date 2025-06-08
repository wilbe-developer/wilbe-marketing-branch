
import { useState } from "react";
import { Search, Video, Headphones, FileText, BookOpen, Layout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const contentTypes = [
  { id: 'all', name: 'All', icon: null },
  { id: 'videos', name: 'Videos', icon: Video },
  { id: 'podcasts', name: 'Podcasts', icon: Headphones },
  { id: 'articles', name: 'Articles', icon: FileText },
  { id: 'tutorials', name: 'Tutorials', icon: BookOpen },
  { id: 'templates', name: 'Templates', icon: Layout },
];

export default function ContentSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  console.log("=== CONTENT SEARCH BAR IS RENDERING ==="); // Very visible debug log
  console.log("Search query:", searchQuery);

  return (
    <div 
      className="bg-red-500 border-4 border-black rounded-lg p-12 w-full mt-16 min-h-[300px] relative z-50"
      style={{ 
        backgroundColor: '#ff0000', 
        border: '4px solid #000000',
        minHeight: '300px',
        display: 'block',
        visibility: 'visible'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            🔍 SEARCH OUR CONTENT LIBRARY 🔍
          </h3>
          <p className="text-white text-lg font-semibold">
            Find videos, podcasts, articles, tutorials, and templates from our founder stories
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-600" />
          <Input
            type="text"
            placeholder="Search videos, podcasts, articles, tutorials, templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 pr-4 py-6 text-xl border-4 border-black rounded-lg focus:ring-4 focus:ring-yellow-500 focus:border-yellow-500 w-full bg-white text-black font-semibold"
          />
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {contentTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = activeFilter === type.id;
            
            return (
              <Button
                key={type.id}
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center gap-3 px-6 py-4 text-base rounded-full transition-all font-semibold ${
                  isActive 
                    ? "bg-yellow-500 text-black hover:bg-yellow-400 border-2 border-black" 
                    : "bg-white text-black border-4 border-black hover:bg-yellow-100"
                }`}
              >
                {IconComponent && <IconComponent className="h-5 w-5" />}
                {type.name}
              </Button>
            );
          })}
        </div>

        {/* Placeholder Results Message */}
        {searchQuery && (
          <div className="mt-8 p-8 bg-yellow-300 border-4 border-black rounded-lg">
            <p className="text-black text-lg text-center font-bold">
              <span className="text-2xl">🚧 Search functionality coming soon! 🚧</span> 
              <br />
              <br />
              You searched for "{searchQuery}" in {contentTypes.find(t => t.id === activeFilter)?.name || 'All content'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
