
import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Play, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoPlayerProps {
  url: string;
  title: string;
}

const VideoPlayer = ({ url, title }: VideoPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const isValidVideoUrl = (url: string) => {
    if (!url) return false;
    
    // Check for common video platforms
    const videoPatterns = [
      /youtube\.com\/watch\?v=|youtu\.be\//,
      /vimeo\.com\//,
      /\.mp4$/,
      /\.webm$/,
      /\.ogg$/
    ];
    
    return videoPatterns.some(pattern => pattern.test(url));
  };

  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Direct video files
    if (url.match(/\.(mp4|webm|ogg)$/)) {
      return url;
    }
    
    return url;
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  if (!isValidVideoUrl(url)) {
    return (
      <Button variant="outline" className="w-full gap-2" disabled>
        <AlertCircle className="w-4 h-4" />
        Invalid Video URL
      </Button>
    );
  }

  const embedUrl = getEmbedUrl(url);
  const isDirectVideo = url.match(/\.(mp4|webm|ogg)$/);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Play className="w-4 h-4" />
          Watch Preview
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          {videoError ? (
            <div className="w-full h-full flex items-center justify-center">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to load video. Please check the video URL.
                </AlertDescription>
              </Alert>
            </div>
          ) : isDirectVideo ? (
            <video
              controls
              className="w-full h-full"
              onError={handleVideoError}
            >
              <source src={embedUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              onError={handleVideoError}
            />
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VideoPlayer;
