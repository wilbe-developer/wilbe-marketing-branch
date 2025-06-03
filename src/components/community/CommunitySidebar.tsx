import { useState } from 'react';
import { Challenge } from '@/types/community';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, MessageCircle, Plus, Lock, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommunitySidebarProps {
  challenges?: Challenge[];
  onSelectTopic: (topic: string) => void;
  selectedTopic: string;
  isMobile: boolean;
  hasPrivateMessages?: boolean;
}

export const CommunitySidebar = ({ 
  challenges = [], 
  onSelectTopic, 
  selectedTopic,
  isMobile,
  hasPrivateMessages = false
}: CommunitySidebarProps) => {
  const [collapsed, setCollapsed] = useState(isMobile);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  // Group challenges by category.
  const categorizedChallenges = challenges.reduce((acc, challenge) => {
    const category = challenge.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  return (
    <div 
      className={cn(
        "bg-white border-r transition-all duration-300 h-[calc(100vh-64px)] sticky top-0",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <div className="flex justify-between items-center p-3 border-b">
        {!collapsed && <h3 className="font-medium">Topics</h3>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="p-2">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start mb-1",
            selectedTopic === 'all' && "bg-slate-100",
            collapsed && "px-2.5 justify-center"
          )}
          onClick={() => onSelectTopic('all')}
        >
          <MessageCircle size={18} className="mr-2" />
          {!collapsed && "All Discussions"}
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start mb-1",
            selectedTopic === 'faqs' && "bg-slate-100",
            collapsed && "px-2.5 justify-center"
          )}
          onClick={() => navigate('/faqs')}
        >
          <HelpCircle size={18} className="mr-2" />
          {!collapsed && "FAQs"}
        </Button>
        
        {hasPrivateMessages && (
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start mb-1",
              selectedTopic === 'private' && "bg-slate-100",
              collapsed && "px-2.5 justify-center"
            )}
            onClick={() => onSelectTopic('private')}
          >
            <Lock size={18} className="mr-2" />
            {!collapsed && "Private Messages"}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start mb-3",
            selectedTopic === 'challenges' && "bg-slate-100",
            collapsed && "px-2.5 justify-center"
          )}
          onClick={() => onSelectTopic('challenges')}
        >
          <BookOpen size={18} className="mr-2" />
          {!collapsed && "BSF Challenges"}
        </Button>
        
        {!collapsed && Object.entries(categorizedChallenges).map(([category, items]) => (
          <div key={category} className="mb-3">
            <div className="text-xs font-semibold uppercase text-gray-500 px-3 py-1 break-words">
              {category}
            </div>
            <div className="space-y-1">
              {items.map(challenge => (
                <Button
                  key={challenge.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm h-auto py-1 px-3 whitespace-normal text-left",
                    selectedTopic === challenge.id && "bg-slate-100"
                  )}
                  onClick={() => onSelectTopic(challenge.id)}
                >
                  {challenge.title}
                </Button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-4">
          <Button 
            className={cn(
              "w-full",
              collapsed && "px-2.5"
            )}
            onClick={() => navigate('/community/new')}
          >
            <Plus size={18} className="mr-2" />
            {!collapsed && "New Thread"}
          </Button>
        </div>
      </div>
    </div>
  );
};
