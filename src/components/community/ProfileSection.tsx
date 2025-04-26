
import React, { useState, useEffect } from 'react';
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
import SiteLoader from '@/components/shared/site-loader'; // Import SiteLoader
import { generateUsername } from 'unique-username-generator'; // Assuming a library for username generation

// Simulate fetching user profile data
const fetchUserProfile = async (userId: string) => {
    // In a real app, fetch from API based on auth/profile ID
    await new Promise(resolve => setTimeout(resolve, 800)); // Increased delay
    // Generate or retrieve a persistent anonymous username
    const username = localStorage.getItem(`connectpro-username-${userId}`) || generateUsername("-", 3, 15);
    localStorage.setItem(`connectpro-username-${userId}`, username);

    return {
        id: userId, // User's actual ID (internal)
        displayName: username, // Pseudonymous, auto-generated name
        bio: localStorage.getItem(`connectpro-bio-${userId}`) || 'Exploring the professional world...',
        avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${username}`, // Use initials avatar
        bannerUrl: `https://picsum.photos/seed/${username}-banner/1000/300`, // Banner based on username seed
        posts: [ // User's posts (simplified)
          { id: 'p1', title: 'Navigating Career Change...', type: 'text' },
        ],
        comments: [ // User's comments (simplified)
           { id: 'c1', postId: 'p2', text: 'Great script, thanks for sharing!' },
        ],
        likedPosts: [ // Liked posts (simplified IDs)
           'p2', 'p3'
        ],
    };
};

interface CommunityProfileSectionProps {
  profileId?: string; // Optional profileId for viewing others' profiles
  viewOnly?: boolean; // Flag to indicate if it's a view-only mode
}

export default function CommunityProfileSection({ profileId, viewOnly = false }: CommunityProfileSectionProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null); // Use any or define a proper type
  const [loading, setLoading] = useState(true); // Start with loading true
  const [saving, setSaving] = useState(false);

  // Determine which user ID to use (logged-in user or viewed profile)
  // TODO: Replace 'user123-self' with actual logged-in user ID from auth context
  const loggedInUserId = 'user123-self';
  const userIdToFetch = profileId || loggedInUserId;
  const isOwnProfile = !viewOnly && userIdToFetch === loggedInUserId;

  useEffect(() => {
      const loadProfile = async () => {
          setLoading(true);
          const data = await fetchUserProfile(userIdToFetch);
          setProfileData(data);
          setLoading(false);
      };
      loadProfile();
  }, [userIdToFetch]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isOwnProfile) return; // Prevent editing if not own profile
    setProfileData((prev: any) => ({ ...prev, bio: e.target.value }));
  };

  const handleSave = async () => {
     if (!isOwnProfile) return;
    setSaving(true);
    console.log("Saving profile:", { bio: profileData.bio }); // Only save editable fields
    // TODO: API call to save profile data (only bio and maybe avatar/banner preferences)
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Update local storage for demo persistence
    localStorage.setItem(`connectpro-bio-${userIdToFetch}`, profileData.bio);
    toast({ title: "Profile Saved", description: "Your community profile bio has been updated." });
    setIsEditing(false);
    setSaving(false);
  };

  const handleCancel = async () => {
      if (!isOwnProfile) return;
      // Refetch original data to discard changes
      setIsEditing(false);
      setLoading(true);
      const data = await fetchUserProfile(userIdToFetch);
      setProfileData(data);
      setLoading(false);
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-[400px]" data-testid="profile-loading">
              <SiteLoader size="lg" />
          </div>
      );
  }

  if (!profileData) {
      return <p className="text-center text-muted-foreground py-8" data-testid="profile-load-error">Could not load profile.</p>;
  }

  return (
    <div className="space-y-6" data-testid={`profile-section-${profileData.id}`}>
      <Card className="overflow-hidden shadow-lg" data-testid="profile-card">
        {/* Banner Image */}
        <div className="relative h-32 md:h-48 bg-muted" data-testid="profile-banner">
           {profileData.bannerUrl ? (
             <img src={profileData.bannerUrl} alt="Profile banner" className="w-full h-full object-cover" />
           ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
           )}
           {/* Edit Banner button can be added if banner customization is allowed */}
        </div>

        <CardContent className="relative pt-0 px-4 pb-4 md:px-6 md:pb-6">
           {/* Avatar and Edit Button */}
           <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4">
              <div className="relative">
                 <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background bg-background" data-testid="profile-avatar">
                    <AvatarImage src={profileData.avatarUrl} alt={profileData.displayName} />
                    <AvatarFallback><UserCircle size={48} /></AvatarFallback>
                 </Avatar>
                  {/* Edit Avatar button can be added if avatar customization is allowed */}
              </div>
             {isOwnProfile && ( // Only show edit buttons if it's the user's own profile
                 isEditing ? (
                    <div className="flex gap-2" data-testid="profile-edit-buttons">
                        <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving} data-testid="profile-cancel-button">Cancel</Button>
                        <Button size="sm" onClick={handleSave} disabled={saving} data-testid="profile-save-button">{saving ? 'Saving...' : 'Save Bio'}</Button>
                    </div>
                 ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} data-testid="profile-edit-bio-button">
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Bio
                    </Button>
                  )
             )}
           </div>

           {/* Profile Info */}
           <div className="space-y-2" data-testid="profile-info">
                 <h1 className="text-xl md:text-2xl font-bold" data-testid="profile-display-name">{profileData.displayName}</h1>
                 {isEditing && isOwnProfile ? (
                    <div data-testid="profile-bio-edit">
                       <Label htmlFor="bio" className="text-xs text-muted-foreground">Bio</Label>
                       <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleBioChange} rows={3} maxLength={160} data-testid="profile-bio-textarea"/>
                       <p className="text-xs text-muted-foreground text-right mt-1">{profileData.bio.length}/160</p>
                    </div>
                 ) : (
                     <p className="text-sm text-muted-foreground" data-testid="profile-bio-display">{profileData.bio || "No bio yet."}</p>
                 )}
                 {/* Removed location and website */}
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                   {/* Add other non-personal, allowed info here if needed */}
                   <span className="flex items-center gap-1 cursor-pointer hover:text-primary" data-testid="profile-share-button"><Share2 size={12} /> Share Profile</span> {/* Add sharing functionality */}
                 </div>
              </div>
        </CardContent>
      </Card>

       {/* Tabs for Posts, Comments, Likes */}
       <Tabs defaultValue="posts" className="w-full" data-testid="profile-tabs">
          <TabsList className="grid w-full grid-cols-3" data-testid="profile-tabs-list">
            <TabsTrigger value="posts" data-testid="profile-tab-posts">Posts</TabsTrigger>
            <TabsTrigger value="comments" data-testid="profile-tab-comments">Comments</TabsTrigger>
            <TabsTrigger value="likes" data-testid="profile-tab-likes">Likes</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" data-testid="profile-content-posts">
             <Card>
                <CardHeader><CardTitle>Posts ({profileData.posts.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                   {profileData.posts.length > 0 ? profileData.posts.map((post: any) => (
                       <p key={post.id} className="text-sm p-2 border rounded bg-muted/50" data-testid={`profile-post-${post.id}`}>{post.title}</p>
                   )) : <p className="text-muted-foreground text-center py-4">No posts yet.</p>}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comments" data-testid="profile-content-comments">
             <Card>
               <CardHeader><CardTitle>Comments ({profileData.comments.length})</CardTitle></CardHeader>
               <CardContent className="space-y-2">
                   {profileData.comments.length > 0 ? profileData.comments.map((comment: any) => (
                       <p key={comment.id} className="text-sm p-2 border rounded bg-muted/50" data-testid={`profile-comment-${comment.id}`}>Comment on post {comment.postId}: "{comment.text.substring(0, 50)}..."</p>
                   )) : <p className="text-muted-foreground text-center py-4">No comments yet.</p>}
               </CardContent>
             </Card>
          </TabsContent>
           <TabsContent value="likes" data-testid="profile-content-likes">
             <Card>
                <CardHeader><CardTitle>Liked Posts ({profileData.likedPosts.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                   {profileData.likedPosts.length > 0 ? profileData.likedPosts.map((postId: string) => (
                       <p key={postId} className="text-sm p-2 border rounded bg-muted/50" data-testid={`profile-liked-post-${postId}`}>Liked post {postId}</p> // Link to post later
                   )) : <p className="text-muted-foreground text-center py-4">No liked posts yet.</p>}
                </CardContent>
             </Card>
           </TabsContent>
        </Tabs>
    </div>
  );
}
