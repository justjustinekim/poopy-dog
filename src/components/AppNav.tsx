
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Camera, Dog, Trophy, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import PhotoUpload from "./PhotoUpload";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const AppNav: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [cameraOpen, setCameraOpen] = useState(false);
  const navigate = useNavigate();
  
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
      onClick: () => setCameraOpen(true),
      path: null
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

  const handlePhotoCapture = (file: File) => {
    // Close camera dialog
    setCameraOpen(false);
    
    // Navigate directly to dashboard with the captured photo data for entry creation
    navigate('/dashboard', { 
      state: { 
        capturedPhoto: URL.createObjectURL(file),
        autoOpenEntryForm: true
      } 
    });
  };
  
  return (
    <>
      <nav className="tab-bar grid grid-cols-5">
        {navItems.map((item) => (
          item.path ? (
            <Link 
              key={item.name}
              to={item.path}
              className={cn(
                "tab-button flex items-center justify-center p-3",
                location.pathname === item.path && "active"
              )}
              aria-label={item.name}
            >
              <item.icon className="h-6 w-6" />
            </Link>
          ) : (
            <button
              key={item.name}
              onClick={item.onClick}
              className="tab-button flex items-center justify-center p-3"
              aria-label={item.name}
            >
              <item.icon className="h-6 w-6" />
            </button>
          )
        ))}
      </nav>

      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <PhotoUpload 
            onPhotoCapture={handlePhotoCapture} 
            className="w-full h-full"
          />
          <button
            onClick={() => setCameraOpen(false)}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white z-[101]"
            aria-label="Close camera"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default AppNav;
