
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, Book, Linkedin, Twitter, Lock } from "lucide-react";
import { Button } from "./ui/button";

interface MemberCardProps {
  member: UserProfile;
  isMember?: boolean;
  onNonMemberClick?: () => void;
}

const MemberCard = ({ member, isMember = true, onNonMemberClick }: MemberCardProps) => {
  return (
    <Card className="overflow-hidden" onClick={!isMember && onNonMemberClick ? onNonMemberClick : undefined}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {isMember ? (
            <Avatar className="h-16 w-16 border shadow">
              <AvatarImage src={member.avatar} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback className="text-lg">
                {member.firstName[0]}{member.lastName[0]}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 blur-sm overflow-hidden rounded-full">
                <Avatar className="h-16 w-16 border shadow">
                  <AvatarImage src={member.avatar} alt="Member photo blurred" />
                  <AvatarFallback className="text-lg">
                    {member.firstName[0]}{member.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          )}
          
          <div className="flex-1">
            {isMember ? (
              <h3 className="text-xl font-semibold mb-1">
                {member.firstName} {member.lastName}
              </h3>
            ) : (
              <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
            )}
            
            {member.expertise && (
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Briefcase className="h-4 w-4 mr-1 inline" />
                {member.expertise}
              </div>
            )}
            
            {member.institution && (
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Book className="h-4 w-4 mr-1 inline" />
                {member.institution}
              </div>
            )}
            
            {member.location && (
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4 mr-1 inline" />
                {member.location}
              </div>
            )}
            
            <div className="flex gap-2 mt-2">
              {member.linkedIn && (
                isMember ? (
                  <a 
                    href={member.linkedIn.startsWith('http') ? member.linkedIn : `https://linkedin.com/in/${member.linkedIn}`} 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="LinkedIn Profile"
                  >
                    <Button variant="ghost" size="sm" className="px-2 h-8">
                      <Linkedin className="h-4 w-4 text-[#0077B5]" />
                    </Button>
                  </a>
                ) : (
                  <Button variant="ghost" size="sm" className="px-2 h-8 opacity-50 cursor-not-allowed">
                    <Linkedin className="h-4 w-4 text-gray-400" />
                  </Button>
                )
              )}
              
              {member.twitterHandle && (
                isMember ? (
                  <a 
                    href={member.twitterHandle.startsWith('http') ? member.twitterHandle : `https://twitter.com/${member.twitterHandle}`} 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label="Twitter Profile"
                  >
                    <Button variant="ghost" size="sm" className="px-2 h-8">
                      <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                    </Button>
                  </a>
                ) : (
                  <Button variant="ghost" size="sm" className="px-2 h-8 opacity-50 cursor-not-allowed">
                    <Twitter className="h-4 w-4 text-gray-400" />
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
        
        {member.about && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 line-clamp-3">{member.about}</p>
          </div>
        )}

        {!isMember && (
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-gray-500 mb-2">Complete your profile to view member details</p>
            <Button size="sm" variant="outline" className="w-full" onClick={onNonMemberClick}>
              <Lock className="h-3 w-3 mr-1" /> Complete Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberCard;
