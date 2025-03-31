
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Image as ImageIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your pet health assistant. Upload a photo or ask me any questions about your dog's poop health.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [dogInfo, setDogInfo] = useState<any | null>(null);
  
  // Get the image and dog info from location state if available
  useEffect(() => {
    if (location.state?.capturedPhoto) {
      setBackgroundImage(location.state.capturedPhoto);
      
      // If we have a photo, add an initial analysis message
      if (!messages.some(m => m.content.includes("I've analyzed the photo"))) {
        setIsLoading(true);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "I've analyzed the photo of your dog's stool sample. What would you like to know about it?",
            timestamp: new Date(),
          }]);
          setIsLoading(false);
        }, 1000);
      }
    }
    
    if (location.state?.dogInfo) {
      setDogInfo(location.state.dogInfo);
    }
  }, [location.state]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call Supabase edge function to get AI response
      const { data, error } = await supabase.functions.invoke('analyze-poop-chat', {
        body: { 
          message: input, 
          imageBase64: backgroundImage ? backgroundImage.split(',')[1] : null,
          dogInfo: dogInfo,
          conversation: messages.map(msg => ({ role: msg.role, content: msg.content }))
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const aiResponse: Message = {
        role: "assistant",
        content: data?.response || "I'm sorry, I'm having trouble generating a response right now.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get response. Please try again.");
      
      // Fallback response
      const fallbackResponse: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting to the server. Please try again in a moment.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = () => {
    // Navigate back to dashboard to capture a new image
    navigate("/dashboard");
    toast.info("Please capture a new photo on the dashboard");
  };

  return (
    <Layout>
      <div 
        className="container max-w-4xl mx-auto px-4 pt-6 pb-20 relative min-h-screen"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Card className="shadow-md relative z-10 bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Pet Health Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[60vh]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === "assistant" ? (
                          <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                        ) : (
                          <User className="h-5 w-5 mt-1 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={uploadImage}
                    className="flex-shrink-0"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about your dog's health..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading} className="flex-shrink-0">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Chat;
