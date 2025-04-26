
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Users, PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for groups (replace with actual API fetch)
const mockGroups = [
  { id: 'g1', name: 'Software Dev Hangout', description: 'Discussing latest trends in software development.', members: 125 },
  { id: 'g2', name: 'Aspiring Data Scientists', description: 'A place to learn and share data science resources.', members: 88 },
  { id: 'g3', name: 'Product Management Circle', description: 'Talk product strategy, roadmaps, and careers.', members: 210 },
  { id: 'g4', name: 'UX/UI Design Hub', description: 'Portfolio reviews, design critiques, and inspiration.', members: 150 },
];

export default function CommunityGroupsSection() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(false); // Simulate loading state

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Discover Groups</span>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => <GroupSkeleton key={i} />)
          ) : filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <Card key={group.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-full">
                    <Users className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{group.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{group.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{group.members} members</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Join</Button>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No groups found matching your search.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const GroupSkeleton = () => (
  <Card className="flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-8 w-16 rounded-md" />
  </Card>
);
