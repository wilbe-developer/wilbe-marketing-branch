
import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/lib/constants";
import { Home, Settings, Users, RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { TutorialProvider, TutorialFloatingButton, Tutorial, useTutorialContext } from "@/components/tutorial";

const ProfileDropdownContent = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { restartTutorial } = useTutorialContext();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleProfileClick = () => {
    navigate(PATHS.SPRINT_PROFILE);
  };

  const handleRestartTutorial = () => {
    restartTutorial();
    toast({
      title: "Tutorial restarted",
      description: "The tutorial will begin again from the first step.",
    });
  };

  return (
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleProfileClick}>
        <Settings className="mr-2 h-4 w-4" />
        <span>Profile Settings</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleRestartTutorial}>
        <RotateCcw className="mr-2 h-4 w-4" />
        <span>Restart Tutorial</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const SprintLayout = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <TutorialProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white shadow-sm py-3 px-4 md:py-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to={PATHS.SPRINT_DASHBOARD} className="text-xl font-bold text-brand-pink">
              BSF Dashboard
            </Link>
            <div data-tutorial-id="community-nav-button">
              <Link to="/community" className="flex items-center">
                <Button variant="ghost" className="flex items-center gap-1.5" title="Community">
                  <Users className="h-5 w-5" />
                  {!isMobile && <span className="text-sm">Community</span>}
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="hidden md:block text-sm text-right">
              <div className="font-medium">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div data-tutorial-id="profile-avatar">
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-brand-pink transition-all duration-200">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <ProfileDropdownContent />
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 py-4 px-3 md:py-6 md:px-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
        <footer className="bg-white py-3 px-4 md:py-4 md:px-6 border-t text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Wilbe. BSF Program.</p>
        </footer>
        
        <TutorialFloatingButton />
        <Tutorial />
      </div>
    </TutorialProvider>
  );
};

export default SprintLayout;
