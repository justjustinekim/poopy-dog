
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Camera, Dog, Trophy, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const AppNav: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Only show on app pages, not on the landing page
  if (location.pathname === "/" || !isMobile) {
    return null;
  }
  
  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/dashboard"
    },
    {
      name: "Social",
      icon: MessageSquare,
      path: "/social"
    },
    {
      name: "Track",
      icon: Camera,
      path: "/dashboard"
    },
    {
      name: "Achievements",
      icon: Trophy,
      path: "/achievements"
    },
    {
      name: "Profile",
      icon: Dog,
      path: "/profile"
    }
  ];
  
  return (
    <nav className="tab-bar">
      {navItems.map((item) => (
        <Link 
          key={item.name}
          to={item.path}
          className={cn(
            "tab-button",
            location.pathname === item.path && "active"
          )}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default AppNav;
