
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Heart, Image, Dog, Send } from "lucide-react";
import { SocialPost } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Mock data for social posts
const mockPosts: SocialPost[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'BarkingMad',
    userAvatarUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=120&q=80',
    content: "Max's poop was super healthy today! 💩👍 #HealthyDog",
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    poopEntryId: 'entry1',
    likes: 24,
    comments: 5,
    createdAt: '2023-06-15T10:30:00Z',
    dogName: 'Max'
  },
  {
    id: '2',
    userId: 'user2',
    username: 'PuppyLover',
    userAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    content: "Luna's been on a new diet and her poop has improved so much! Look at that consistency! #DogHealth #NewDiet",
    imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=400&q=80',
    likes: 17,
    comments: 3,
    createdAt: '2023-06-14T15:45:00Z',
    dogName: 'Luna'
  },
  {
    id: '3',
    userId: 'user3',
    username: 'DoggyStyle',
    userAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    content: "Anyone else's dog have weird poop after eating chicken? Charlie always gets these yellow spots. #DogParentProblems",
    likes: 32,
    comments: 11,
    createdAt: '2023-06-13T08:20:00Z',
    dogName: 'Charlie'
  }
];

const Social: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const { toast } = useToast();
  
  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
    
    toast({
      title: "Post liked!",
      description: "Keep spreading positivity in the community!",
      className: "bg-secondary text-white",
    });
  };
  
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) return;
    
    const newPost: SocialPost = {
      id: `new-${Date.now()}`,
      userId: 'currentUser',
      username: 'You',
      content: newPostContent,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      dogName: 'Your Dog'
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    
    toast({
      title: "Post shared!",
      description: "Your post is now visible to the community",
    });
  };
  
  return (
    <Layout className="pb-20">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">PupSocial</h1>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=120&q=80" />
            <AvatarFallback>
              <Dog className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </header>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handlePostSubmit}>
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=120&q=80" />
                  <AvatarFallback>
                    <Dog className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <Input 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your pup's poop journey..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="rounded-full">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" className="gap-1">
                  <Image className="h-4 w-4" />
                  <span>Photo</span>
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-1">
                  <Dog className="h-4 w-4" />
                  <span>Tag Dog</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="friends">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="cartoon-bubble overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center space-y-0 gap-3">
                  <Avatar>
                    <AvatarImage src={post.userAvatarUrl} />
                    <AvatarFallback>
                      <Dog className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{post.username}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()} • 
                      {post.dogName && <span className="ml-1">{post.dogName}</span>}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  <p className="text-sm mb-3">{post.content}</p>
                  {post.imageUrl && (
                    <div className="rounded-lg overflow-hidden mb-2">
                      <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-3 pt-0 flex justify-between border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-gray-500 hover:text-red-500"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="trending" className="h-[300px] flex items-center justify-center text-gray-500">
            Trending posts coming soon!
          </TabsContent>
          
          <TabsContent value="experts" className="h-[300px] flex items-center justify-center text-gray-500">
            Expert advice coming soon!
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Social;
