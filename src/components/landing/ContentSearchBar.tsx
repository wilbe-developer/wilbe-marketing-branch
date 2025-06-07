
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

  console.log("ContentSearchBar is rendering with query:", searchQuery); // Debug log

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-8 w-full mt-12 min-h-[200px]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Search Our Content Library
          </h3>
          <p className="text-gray-700 text-base">
            Find videos, podcasts, articles, tutorials, and templates from our founder stories
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search videos, podcasts, articles, tutorials, templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-white"
          />
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {contentTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = activeFilter === type.id;
            
            return (
              <Button
                key={type.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm rounded-full transition-all ${
                  isActive 
                    ? "bg-gray-900 text-white hover:bg-gray-800" 
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {type.name}
              </Button>
            );
          })}
        </div>

        {/* Placeholder Results Message */}
        {searchQuery && (
          <div className="mt-6 p-6 bg-blue-100 border-2 border-blue-300 rounded-lg">
            <p className="text-blue-900 text-base text-center">
              <span className="font-semibold">Search functionality coming soon!</span> 
              <br />
              You searched for "{searchQuery}" in {contentTypes.find(t => t.id === activeFilter)?.name || 'All content'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
