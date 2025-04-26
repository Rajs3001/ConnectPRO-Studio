
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, UserCircle, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ShortVideo {
  id: string;
  url: string; // Video URL (use placeholders for now)
  title: string;
  uploaderName: string; // Anonymous display name
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

// Global Mute State (Simulated - replace with context or Zustand/Redux in a real app)
let isGloballyMuted = false; // Default to unmuted as per request
const muteListeners = new Set<(muted: boolean) => void>();

const useGlobalMuteState = (): [boolean, (muted: boolean) => void] => {
    const [isMuted, setIsMuted] = useState(isGloballyMuted);

    useEffect(() => {
        const listener = (muted: boolean) => setIsMuted(muted);
        muteListeners.add(listener);
        return () => {
            muteListeners.delete(listener);
        };
    }, []);

    const setGlobalMute = useCallback((muted: boolean) => {
        isGloballyMuted = muted;
        muteListeners.forEach(listener => listener(muted));
    }, []);

    return [isMuted, setGlobalMute];
};


// Mock data for Pro Shorts
const mockShorts: ShortVideo[] = [
  { id: 's1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Quick Git Tips', uploaderName: 'CodeNinja', likes: 1200, comments: 45, shares: 150, isLiked: false },
  { id: 's2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: 'React State Management in 60s', uploaderName: 'ReactGuru', likes: 2500, comments: 112, shares: 320, isLiked: true },
  { id: 's3', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'CSS Flexbox Explained Fast', uploaderName: 'CSSWizard', likes: 800, comments: 23, shares: 90, isLiked: false },
  { id: 's4', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'Python List Comprehensions', uploaderName: 'Pythonista', likes: 1800, comments: 78, shares: 210, isLiked: false },
];

const ShortCard: React.FC<{ short: ShortVideo; isVisible: boolean; onLike: (id: string) => void }> = ({ short, isVisible, onLike }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMutedGlobally] = useGlobalMuteState(); // Use global mute state hook

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Apply global mute state immediately
    videoElement.muted = isMuted;

    if (isVisible) {
      // Attempt to play when visible
      videoElement.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        // Autoplay might be blocked, user interaction needed
        console.warn("Autoplay blocked for short:", short.id, error);
        setIsPlaying(false); // Show play button if autoplay fails
      });
    } else {
      // Pause when not visible
      videoElement.pause();
      setIsPlaying(false);
      // Optionally reset time for short loops if desired when they become invisible
      // videoElement.currentTime = 0;
    }
  }, [isVisible, short.id, isMuted]); // Depend on isMuted from global state

  const togglePlay = (event: React.MouseEvent<HTMLVideoElement>) => {
    // Prevent the mute toggle from also triggering play/pause if clicked on the mute icon area (though it's outside the video)
    event.stopPropagation();
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (videoElement.paused || videoElement.ended) {
      videoElement.play().then(() => setIsPlaying(true)).catch(err => console.error("Play error:", err));
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (event: React.MouseEvent<HTMLButtonElement>) => {
     event.stopPropagation(); // Prevent click from bubbling to video togglePlay
     const videoElement = videoRef.current;
     if (!videoElement) return;
     const newMuteState = !isMuted;
     videoElement.muted = newMuteState;
     setIsMutedGlobally(newMuteState); // Update global state
   };


  return (
    <Card className="h-[calc(100vh-10rem)] w-full snap-center shrink-0 relative overflow-hidden rounded-lg shadow-xl bg-background flex items-center justify-center">
      <video
        ref={videoRef}
        src={short.url}
        loop
        playsInline // Important for mobile autoplay
        muted={isMuted} // Controlled by global state
        className="absolute inset-0 w-full h-full object-cover cursor-pointer" // Add cursor pointer
        onClick={togglePlay} // Toggle play/pause on video click
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Overlay for controls and info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-between p-4 text-white pointer-events-none"> {/* Make overlay non-interactive for clicks */}
        {/* Top Info (optional) */}
        <div></div>

        {/* Bottom Info */}
        <div className="flex justify-between items-end">
          {/* Left: Title/Uploader */}
          <div className="space-y-1">
             <h3 className="font-bold text-sm drop-shadow-md">{short.title}</h3>
             <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border-2 border-white/50">
                  {/* Placeholder avatar */}
                   <AvatarFallback className="text-xs bg-muted/30 text-white">{short.uploaderName.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium drop-shadow">{short.uploaderName}</p>
             </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col items-center space-y-3 pointer-events-auto"> {/* Make actions interactive */}
             <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10" onClick={() => onLike(short.id)}>
                <Heart className={cn("h-6 w-6", short.isLiked && "fill-red-500 text-red-500")} />
                <span className="text-[10px] mt-0.5">{short.likes}</span>
             </Button>
             <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10">
                <MessageCircle className="h-6 w-6" />
                 <span className="text-[10px] mt-0.5">{short.comments}</span>
             </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10">
                 <Share2 className="h-6 w-6" />
                 <span className="text-[10px] mt-0.5">{short.shares}</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10" onClick={toggleMute}>
                 {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
          </div>
        </div>
      </div>

       {/* Play/Pause indicator in center (only show if paused AND visible) */}
       {!isPlaying && isVisible && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <Play className="h-16 w-16 text-white/70" fill="currentColor" />
         </div>
       )}
    </Card>
  );
};

export default function ProShortsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleShortIndex, setVisibleShortIndex] = useState(0);
  const [shortsData, setShortsData] = useState<ShortVideo[]>(mockShorts); // Use state for likes

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollPosition = container.scrollTop;
    const cardHeight = container.clientHeight; // Height of the viewport

    const newIndex = Math.round(scrollPosition / cardHeight);
     if (newIndex !== visibleShortIndex) {
        setVisibleShortIndex(newIndex);
     }
  }, [visibleShortIndex]); // Only depend on visibleShortIndex to prevent excessive updates

  useEffect(() => {
    const container = containerRef.current;
    // Debounce scroll handler
     let scrollTimeout: NodeJS.Timeout;
     const debouncedScrollHandler = () => {
         clearTimeout(scrollTimeout);
         scrollTimeout = setTimeout(handleScroll, 50); // Adjust debounce time as needed
     };

    container?.addEventListener('scroll', debouncedScrollHandler);
    return () => {
         container?.removeEventListener('scroll', debouncedScrollHandler);
         clearTimeout(scrollTimeout);
     };
  }, [handleScroll]); // Rerun effect if handleScroll changes (due to visibleShortIndex dependency)

  // Handle scroll buttons
  const scrollByCard = (direction: 'up' | 'down') => {
     const container = containerRef.current;
     if (!container) return;
     const cardHeight = container.clientHeight;
     const currentScroll = container.scrollTop;
     const targetIndex = direction === 'up' ? Math.max(0, visibleShortIndex - 1) : Math.min(shortsData.length - 1, visibleShortIndex + 1);
     const targetScroll = targetIndex * cardHeight;

     // Use smooth scrolling
     container.scrollTo({ top: targetScroll, behavior: 'smooth' });

     // Update visible index immediately for button disable state, scroll handler will confirm later
     // setVisibleShortIndex(targetIndex); // Potentially causes race condition, let scroll handler manage it.
   };


   const handleLike = (id: string) => {
       setShortsData(prev =>
           prev.map(short =>
               short.id === id
                   ? { ...short, isLiked: !short.isLiked, likes: short.isLiked ? short.likes - 1 : short.likes + 1 }
                   : short
           )
       );
       // TODO: API call to update like status
       console.log(`Toggled like for short ${id}`);
    };


  return (
    <div className="relative h-[calc(100vh-10rem)] w-full max-w-md mx-auto">
       {/* Scrollable Container for Shorts */}
       <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-hide rounded-lg border border-border/60"
       >
          {shortsData.length > 0 ? (
            shortsData.map((short, index) => (
              <ShortCard
                key={short.id}
                short={short}
                isVisible={index === visibleShortIndex}
                onLike={handleLike}
              />
            ))
          ) : (
            <div className="h-full w-full snap-center shrink-0 flex items-center justify-center">
              <p className="text-muted-foreground">No shorts available yet.</p>
            </div>
          )}
        </div>

        {/* Optional Scroll Buttons */}
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white bg-black/30 hover:bg-black/50 disabled:opacity-30"
            onClick={() => scrollByCard('up')}
            disabled={visibleShortIndex === 0}
            aria-label="Scroll Up"
        >
            <ChevronUp className="h-5 w-5" />
        </Button>
         <Button
             variant="ghost"
             size="icon"
             className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white bg-black/30 hover:bg-black/50 disabled:opacity-30"
             onClick={() => scrollByCard('down')}
             disabled={visibleShortIndex === shortsData.length - 1}
             aria-label="Scroll Down"
         >
             <ChevronDown className="h-5 w-5" />
         </Button>
     </div>
  );
}


    