
import React, { useState, useEffect } from 'react';
import { useProfile, Profile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Save } from 'lucide-react';
import { toast } from 'sonner';

const ProfileForm: React.FC = () => {
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const [formData, setFormData] = useState<Partial<Profile>>({
    username: '',
    avatar_url: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        avatar_url: profile.avatar_url
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({
        username: formData.username
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl) {
        setFormData({
          ...formData,
          avatar_url: avatarUrl
        });
        toast.success('Avatar uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>Loading your profile information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Your Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={formData.avatar_url || undefined} alt="Profile picture" />
              <AvatarFallback>{formData.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="relative">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarUpload}
              />
              <Label htmlFor="avatar" className="cursor-pointer">
                <Button variant="outline" size="sm" type="button" className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Picture
                </Button>
              </Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username || ''}
              onChange={handleInputChange}
              placeholder="Your username"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isUpdating} className="w-full">
            {isUpdating ? 'Updating...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm;
