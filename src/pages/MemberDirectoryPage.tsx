
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
import ProfileCompletionDialog from "@/components/ProfileCompletionDialog";

const MemberDirectoryPage = () => {
  const { members, loading, searchMembers } = useMembers();
  const { isMember } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };
  
  const filteredMembers = debouncedQuery 
    ? searchMembers(debouncedQuery)
    : members;

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
          {!isMember && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2 text-center">Meet Our Community</h3>
              <p className="text-blue-700 mb-4 text-center">
                Complete your profile to connect with our full community of scientists and entrepreneurs.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => setShowProfileDialog(true)}>
                  Complete Your Profile
                </Button>
              </div>
            </div>
          )}
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard 
                  key={member.id} 
                  member={member} 
                  isMember={isMember}
                  onNonMemberClick={() => setShowProfileDialog(true)}
                />
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

      <ProfileCompletionDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </div>
  );
};

export default MemberDirectoryPage;
