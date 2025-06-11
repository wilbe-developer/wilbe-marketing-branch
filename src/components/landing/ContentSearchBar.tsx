
import { useState } from "react";
import { Search, Video, Headphones, FileText, BookOpen, Layout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useContentSearch } from "@/hooks/useContentSearch";

const contentTypes = [
  { id: 'all', name: 'All', icon: null },
  { id: 'videos', name: 'Videos', icon: Video },
  { id: 'podcasts', name: 'Podcasts', icon: Headphones },
  { id: 'articles', name: 'Articles', icon: FileText },
  { id: 'tutorials', name: 'Tutorials', icon: BookOpen },
  { id: 'templates', name: 'Templates', icon: Layout },
];

export default function ContentSearchBar() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { query, results, isSearching, handleSearch } = useContentSearch();

  // Filter results based on active filter
  const filteredResults = results.filter(result => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'videos') return result.type === 'video';
    // For now, only videos and pages are implemented
    return false;
  });

  return (
    <div className="bg-gray-50 rounded-lg p-8 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Know-how for scientist founders
          </h3>
          <p className="text-gray-600">
            Find material for all stages from exploring to growing a venture
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search videos, podcasts, articles, tutorials, templates..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-3 text-base border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-primary w-full bg-white"
          />
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {contentTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = activeFilter === type.id;
            
            return (
              <Button
                key={type.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(type.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {type.name}
              </Button>
            );
          })}
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 text-center">Searching...</p>
          </div>
        )}

        {!isSearching && query && filteredResults.length === 0 && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-gray-600 text-center">
              No results found for "{query}" in {contentTypes.find(t => t.id === activeFilter)?.name || 'All content'}
            </p>
          </div>
        )}

        {!isSearching && filteredResults.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">
              Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredResults.map((result) => (
                <Link
                  key={result.id}
                  to={result.url}
                  className="block p-4 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    {result.type === 'video' && <Video className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />}
                    {result.type === 'page' && <FileText className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {result.description}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs bg-white text-gray-700 rounded mt-2 capitalize border">
                        {result.type}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
