
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Camera, Dog, Trophy, MessageSquare, X, PawPrint } from "lucide-react";
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
  
  // Show on all pages when on mobile
  if (!isMobile) {
    return null;
  }
  
  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/"
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
      path: null,
      badge: "💩"
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
      <nav className="tab-bar grid grid-cols-5 rounded-t-xl">
        {navItems.map((item) => (
          item.path ? (
            <Link 
              key={item.name}
              to={item.path}
              className={cn(
                "tab-button flex flex-col items-center justify-center p-3 relative",
                location.pathname === item.path && "active"
              )}
              aria-label={item.name}
            >
              <item.icon className="h-6 w-6" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 text-lg scale-130">{item.badge}</span>
              )}
            </Link>
          ) : (
            <button
              key={item.name}
              onClick={item.onClick}
              className="tab-button flex flex-col items-center justify-center p-3 relative"
              aria-label={item.name}
            >
              <item.icon className="h-6 w-6" />
              {item.badge && (
                <span className="absolute top-1 -right-1 text-lg scale-130">{item.badge}</span>
              )}
              {item.name === "Track" && (
                <div className="absolute -top-1 -right-1 bg-primary/10 rounded-full p-1">
                  <PawPrint size={12} className="text-primary fill-primary/20" />
                </div>
              )}
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
          
          {/* Playful elements in camera view */}
          <div className="absolute bottom-24 right-6 z-[101] animate-float">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <span className="text-2xl">💩</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppNav;
