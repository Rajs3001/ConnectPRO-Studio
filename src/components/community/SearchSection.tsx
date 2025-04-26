
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Users, Hash, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Mock search results (replace with actual API fetch based on query)
const mockResults = {
  posts: [
    { id: 'p1', title: 'Navigating Career Change in Tech?', excerpt: '...' },
    { id: 'p5', title: 'Best Practices for API Design?', excerpt: '...' },
  ],
  users: [ // Profiles
    { id: 'u123', displayName: 'CuriousCoder', avatar: 'https://picsum.photos/seed/curiouscoder/40/40' },
    { id: 'u456', displayName: 'DesignGuru', avatar: 'https://picsum.photos/seed/designguru/40/40' },
  ],
  groups: [
    { id: 'g1', name: 'Software Dev Hangout', members: 125 },
    { id: 'g3', name: 'Product Management Circle', members: 210 },
  ],
  tags: ['career', 'tech', 'api', 'design', 'python'],
};

// Mock suggestions (could be popular tags, recent searches, etc.)
const mockSuggestions = ['#react', '#careeradvice', 'Software Engineering Group', 'Product Management'];

export default function CommunitySearchSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    console.log("Searching community for:", searchTerm);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    // Filter mock results based on term (basic example)
    const filteredResults = {
        posts: mockResults.posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())),
        users: mockResults.users.filter(u => u.displayName.toLowerCase().includes(searchTerm.toLowerCase())),
        groups: mockResults.groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())),
        tags: mockResults.tags.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())),
    };
    setResults(filteredResults);
    setLoading(false);
  };

  const hasResults = results && (results.posts.length > 0 || results.users.length > 0 || results.groups.length > 0 || results.tags.length > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Community</CardTitle>
          <form onSubmit={handleSearch} className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts, people, groups, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {/* <Button type="submit" size="sm" className="absolute right-1 top-1 h-7">Search</Button> */}
          </form>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SearchSkeleton />
          ) : results ? (
             hasResults ? (
                <div className="space-y-4">
                    {/* Display results by category */}
                    {results.posts.length > 0 && (
                        <SearchResultCategory title="Posts" icon={FileText}>
                            {results.posts.map(post => (
                                <Link key={post.id} href={`/community/post/${post.id}`} className="block p-2 hover:bg-muted/50 rounded">
                                    <p className="text-sm font-medium">{post.title}</p>
                                </Link>
                            ))}
                        </SearchResultCategory>
                    )}
                    {results.users.length > 0 && (
                         <SearchResultCategory title="People" icon={Users}>
                             {results.users.map(user => (
                                 <Link key={user.id} href={`/community/profile/${user.id}`} className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded">
                                    <img src={user.avatar} alt={user.displayName} className="h-6 w-6 rounded-full" />
                                    <p className="text-sm font-medium">{user.displayName}</p>
                                </Link>
                            ))}
                        </SearchResultCategory>
                    )}
                    {results.groups.length > 0 && (
                        <SearchResultCategory title="Groups" icon={Users}>
                            {results.groups.map(group => (
                                <Link key={group.id} href={`/community/group/${group.id}`} className="block p-2 hover:bg-muted/50 rounded">
                                     <p className="text-sm font-medium">{group.name}</p>
                                     <p className="text-xs text-muted-foreground">{group.members} members</p>
                                </Link>
                            ))}
                         </SearchResultCategory>
                    )}
                    {results.tags.length > 0 && (
                         <SearchResultCategory title="Tags" icon={Hash}>
                            <div className="flex flex-wrap gap-2 p-2">
                                {results.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">#{tag}</Badge>
                                ))}
                             </div>
                        </SearchResultCategory>
                    )}
                </div>
             ) : (
                 <p className="text-center text-muted-foreground py-4">No results found for "{searchTerm}".</p>
             )
          ) : (
            // Show suggestions or popular items before search
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Suggestions</h3>
              <div className="flex flex-wrap gap-2">
                {mockSuggestions.map((suggestion, i) => (
                  <Badge key={i} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setSearchTerm(suggestion.replace('#', ''))}>
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton for search results
const SearchSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <div className="space-y-1 p-2 border rounded">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Helper component for result categories
const SearchResultCategory: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-1.5"><Icon size={14} /> {title}</h3>
    <div className="space-y-1 border rounded p-1">
        {children}
    </div>
  </div>
);
