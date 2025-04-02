
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Dog, User } from "lucide-react";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    try {
      await signIn(email, password);
      // Navigate will be handled by AuthContext via auth state change
    } catch (error: any) {
      console.error("Error signing in:", error);
      setErrorMessage(error.message || "Failed to sign in");
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!username) {
      setErrorMessage("Username is required");
      return;
    }
    
    try {
      // Include username in user metadata
      await signUp(email, password, {
        data: {
          username
        }
      });
      // Navigate will be handled by AuthContext after email confirmation
    } catch (error: any) {
      console.error("Error signing up:", error);
      setErrorMessage(error.message || "Failed to sign up");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-background/80">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Dog className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">PoopyDog</CardTitle>
          <CardDescription>Track, analyze, and improve your dog's health</CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password">Password</Label>
                    <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="signin-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {errorMessage && (
                  <div className="text-sm text-red-500">{errorMessage}</div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Choose a username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="Create a password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters
                  </p>
                </div>
                
                {errorMessage && (
                  <div className="text-sm text-red-500">{errorMessage}</div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm text-gray-500 p-4 border-t">
          <p>
            By continuing, you agree to our{" "}
            <Button variant="link" className="text-xs p-0 h-auto">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="text-xs p-0 h-auto">
              Privacy Policy
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
