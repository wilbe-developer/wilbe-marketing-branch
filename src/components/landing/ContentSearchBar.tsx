
import { useState } from "react";
import { Search, Video, Headphones, FileText, BookOpen, Layout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const contentTypes = [
  { id: 'all', name: 'All', icon: null },
  { id: 'exploring', name: 'Exploring', icon: null },
  { id: 'kick-off', name: 'Kick-off', icon: null },
  { id: 'growth', name: 'Growth', icon: null },
];

export default function ContentSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

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
            placeholder="Search content for your journey stage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-base border border-gray-200 rounded-md focus:ring-2 focus:ring-primary focus:border-primary w-full bg-white"
          />
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {contentTypes.map((type) => {
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
                {type.name}
              </Button>
            );
          })}
        </div>

        {/* Placeholder Results Message */}
        {searchQuery && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 text-center">
              <span className="font-medium">Search functionality coming soon!</span> 
              <br />
              You searched for "{searchQuery}" in {contentTypes.find(t => t.id === activeFilter)?.name || 'All stages'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
