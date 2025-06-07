
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

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Search Our Content Library
          </h3>
          <p className="text-gray-600 text-sm">
            Find videos, podcasts, articles, tutorials, and templates from our founder stories
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search videos, podcasts, articles, tutorials, templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-base border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          />
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {contentTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = activeFilter === type.id;
            
            return (
              <Button
                key={type.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs rounded-full transition-all ${
                  isActive 
                    ? "bg-gray-900 text-white hover:bg-gray-800" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {IconComponent && <IconComponent className="h-3 w-3" />}
                {type.name}
              </Button>
            );
          })}
        </div>

        {/* Placeholder Results Message */}
        {searchQuery && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm text-center">
              <span className="font-medium">Search functionality coming soon!</span> 
              <br />
              You searched for "{searchQuery}" in {contentTypes.find(t => t.id === activeFilter)?.name || 'All content'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
