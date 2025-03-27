
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dog, Menu, X, Trophy, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isAppPage = !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Social", path: "/social" },
    { label: "Profile", path: "/profile" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  // App-like header for internal pages on mobile
  if (isAppPage && isMobile) {
    return (
      <header className="app-bar rounded-b-xl">
        <Link to="/" className="flex items-center space-x-2">
          <Dog className="h-6 w-6 text-white wiggle" />
          <span className="text-xl font-bold tracking-tight">PupPoopVision</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link to="/achievements">
            <Badge variant="outline" className="bg-yellow-400 text-primary border-none px-2">
              <Trophy className="h-3 w-3 mr-1" />
              <span className="text-xs">Level 5</span>
            </Badge>
          </Link>
          {user && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAuthAction} 
              className="ml-2 text-white hover:text-white/80 hover:bg-transparent"
            >
              Sign Out
            </Button>
          )}
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300",
        isScrolled || !isHomePage || isMobileMenuOpen
          ? "bg-white/95 backdrop-blur-lg shadow-md py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <Dog className="h-8 w-8 text-primary animate-float relative z-10" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10"></div>
              </div>
              <span className="text-xl font-bold tracking-tight cartoon-text">PupPoopVision</span>
              <Badge className="ml-2 hidden md:flex bg-yellow-400 text-primary border-none">BETA</Badge>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative group",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-gray-600"
                )}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Button 
              size="sm" 
              className="ml-4 rounded-xl font-medium cartoon-text"
              onClick={handleAuthAction}
            >
              {user ? "Sign Out" : (
                <>
                  <LogIn className="mr-1 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center p-2 rounded-md"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 glass divide-y divide-gray-100 transition-all duration-200 transform",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="py-4 px-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === link.path
                  ? "text-primary bg-primary/5"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Button 
              className="w-full rounded-xl font-medium cartoon-text"
              onClick={handleAuthAction}
            >
              {user ? "Sign Out" : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
