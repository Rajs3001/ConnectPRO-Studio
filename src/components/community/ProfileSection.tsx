
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Edit3, Link as LinkIcon, MapPin, Settings, UserCircle, Share2 } from 'lucide-react'; // Added icons
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Mock User Profile Data (Replace with actual fetch/auth context)
const mockUserProfile = {
  id: 'user123', // Unique community profile ID
  displayName: 'CuriousCoder', // Editable display name
  bio: 'Lifelong learner exploring the intersection of tech and design. Always open to connecting!',
  location: 'Remote | Planet Earth',
  website: 'https://example.com',
  avatarUrl: 'https://picsum.photos/seed/curiouscoder/128/128',
  bannerUrl: 'https://picsum.photos/seed/coderbanner/1000/300', // Profile banner image
  posts: [ // User's posts (simplified)
    { id: 'p1', title: 'Navigating Career Change...', type: 'text' },
    { id: 'p5', title: 'Best Practices for API Design?', type: 'text' },
  ],
  comments: [ // User's comments (simplified)
     { id: 'c1', postId: 'p2', text: 'Great script, thanks for sharing!' },
  ],
  likedPosts: [ // Liked posts (simplified IDs)
     'p2', 'p3'
  ],
};

export default function CommunityProfileSection() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockUserProfile);
  const [loading, setLoading] = useState(false); // Simulate loading/saving

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    console.log("Saving profile:", profileData);
    // TODO: API call to save profile data
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Update mock data (in real app, you'd likely refetch or rely on cache update)
    Object.assign(mockUserProfile, profileData);
    toast({ title: "Profile Saved", description: "Your community profile has been updated." });
    setIsEditing(false);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg">
        {/* Banner Image */}
        <div className="relative h-32 md:h-48 bg-muted">
           {profileData.bannerUrl ? (
             <img src={profileData.bannerUrl} alt="Profile banner" className="w-full h-full object-cover" />
           ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
           )}
           {isEditing && (
             <Button size="icon" variant="secondary" className="absolute bottom-2 right-2 h-8 w-8 rounded-full">
               <Camera size={16} />
               <span className="sr-only">Edit Banner</span>
             </Button>
           )}
        </div>

        <CardContent className="relative pt-0 px-4 pb-4 md:px-6 md:pb-6">
           {/* Avatar and Edit Button */}
           <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4">
              <div className="relative">
                 <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background bg-background">
                    <AvatarImage src={profileData.avatarUrl} alt={profileData.displayName} />
                    <AvatarFallback><UserCircle size={48} /></AvatarFallback>
                 </Avatar>
                 {isEditing && (
                     <Button size="icon" variant="secondary" className="absolute bottom-1 right-1 h-7 w-7 rounded-full">
                       <Camera size={14} />
                       <span className="sr-only">Edit Avatar</span>
                    </Button>
                 )}
              </div>
             {isEditing ? (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setProfileData(mockUserProfile); /* Reset changes */ }}>Cancel</Button>
                    <Button size="sm" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</Button>
                </div>
             ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              )}
           </div>

           {/* Profile Info */}
           {isEditing ? (
             <div className="space-y-3">
                <div>
                   <Label htmlFor="displayName" className="text-xs text-muted-foreground">Display Name</Label>
                   <Input id="displayName" name="displayName" value={profileData.displayName} onChange={handleInputChange} className="text-lg font-bold h-9" />
                </div>
                 <div>
                   <Label htmlFor="bio" className="text-xs text-muted-foreground">Bio</Label>
                   <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleInputChange} rows={3} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                       <Label htmlFor="location" className="text-xs text-muted-foreground">Location</Label>
                       <Input id="location" name="location" value={profileData.location} onChange={handleInputChange} />
                    </div>
                    <div>
                       <Label htmlFor="website" className="text-xs text-muted-foreground">Website</Label>
                       <Input id="website" name="website" type="url" value={profileData.website} onChange={handleInputChange} placeholder="https://" />
                    </div>
                </div>
             </div>
           ) : (
              <div className="space-y-2">
                 <h1 className="text-xl md:text-2xl font-bold">{profileData.displayName}</h1>
                 <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                   {profileData.location && <span className="flex items-center gap-1"><MapPin size={12} /> {profileData.location}</span>}
                   {profileData.website && <span className="flex items-center gap-1"><LinkIcon size={12} /> <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profileData.website.replace(/^https?:\/\//, '')}</a></span>}
                   <span className="flex items-center gap-1"><Share2 size={12} /> Share Profile</span> {/* Add sharing functionality */}
                 </div>
              </div>
           )}
        </CardContent>
      </Card>

       {/* Tabs for Posts, Comments, Likes */}
       <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
             <Card>
                <CardHeader><CardTitle>My Posts ({profileData.posts.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                   {profileData.posts.length > 0 ? profileData.posts.map(post => (
                       <p key={post.id} className="text-sm p-2 border rounded bg-muted/50">{post.title}</p>
                   )) : <p className="text-muted-foreground text-center py-4">No posts yet.</p>}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comments">
             <Card>
               <CardHeader><CardTitle>My Comments ({profileData.comments.length})</CardTitle></CardHeader>
               <CardContent className="space-y-2">
                   {profileData.comments.length > 0 ? profileData.comments.map(comment => (
                       <p key={comment.id} className="text-sm p-2 border rounded bg-muted/50">Comment on post {comment.postId}: "{comment.text.substring(0, 50)}..."</p>
                   )) : <p className="text-muted-foreground text-center py-4">No comments yet.</p>}
               </CardContent>
             </Card>
          </TabsContent>
           <TabsContent value="likes">
             <Card>
                <CardHeader><CardTitle>Liked Posts ({profileData.likedPosts.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                   {profileData.likedPosts.length > 0 ? profileData.likedPosts.map(postId => (
                       <p key={postId} className="text-sm p-2 border rounded bg-muted/50">Liked post {postId}</p> // Link to post later
                   )) : <p className="text-muted-foreground text-center py-4">No liked posts yet.</p>}
                </CardContent>
             </Card>
           </TabsContent>
        </Tabs>
    </div>
  );
}
