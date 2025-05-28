
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMembers } from "@/hooks/useMembers";
import { useAuth } from "@/hooks/useAuth";
import MemberCard from "@/components/MemberCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Lock, Users } from "lucide-react";
import { PATHS } from "@/lib/constants";

const MemberDirectoryPage = () => {
  const { members, loading, searchMembers } = useMembers();
  const { isMember } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };
  
  const filteredMembers = debouncedQuery 
    ? searchMembers(debouncedQuery)
    : members;

  // Show member-only access message if user is not a member
  if (!isMember) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-sm p-12">
          <Lock className="h-16 w-16 mx-auto text-gray-400 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Member Directory</h1>
          <p className="text-lg text-gray-600 mb-6">
            Connect with like-minded scientists and entrepreneurs from around the world.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <Users className="h-8 w-8 mx-auto text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Members-Only Feature</h3>
            <p className="text-blue-700 mb-4">
              This directory is exclusively available to Wilbe community members. Join our community to:
            </p>
            <ul className="text-left text-blue-700 mb-4 space-y-1">
              <li>• Browse and search through our member directory</li>
              <li>• Connect with fellow scientists and entrepreneurs</li>
              <li>• Access member profiles and expertise areas</li>
              <li>• Build your professional network</li>
            </ul>
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to={PATHS.REGISTER}>
                Become a Member
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={PATHS.HOME}>
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Meet Your Community</h1>
        
        <form 
          onSubmit={handleSearch}
          className="max-w-md mx-auto flex gap-2"
        >
          <Input
            type="text"
            placeholder="Search by name, expertise, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            Search
          </Button>
        </form>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="ml-4 space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <>
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-medium mb-2">No members found</h2>
              <p className="text-gray-500">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberDirectoryPage;
