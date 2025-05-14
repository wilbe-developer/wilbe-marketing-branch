
import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/lib/constants";
import { Home, Settings, Users } from "lucide-react";
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

const SprintLayout = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleProfileClick = () => {
    navigate(PATHS.PROFILE);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm py-3 px-4 md:py-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to={PATHS.SPRINT_DASHBOARD} className="text-xl font-bold text-brand-pink">
            Sprint Dashboard
          </Link>
          <Link to="/community" className="flex items-center">
            <Button variant="ghost" className="flex items-center gap-1.5" title="Community">
              <Users className="h-5 w-5" />
              {!isMobile && <span className="text-sm">Community</span>}
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="hidden md:block text-sm text-right">
            <div className="font-medium">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-brand-pink transition-all duration-200">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 py-4 px-3 md:py-6 md:px-6 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="bg-white py-3 px-4 md:py-4 md:px-6 border-t text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Wilbe. Sprint Program.</p>
      </footer>
    </div>
  );
};

export default SprintLayout;
