import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Trash2, ImageOff } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
interface FilmCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  director: string;
  videoUrl?: string;
  imageUrl?: string;
  genre?: string;
  onMint: () => void;
  onDelete?: () => void;
}
const FilmCard = ({
  id,
  title,
  description,
  price,
  director,
  videoUrl = "",
  imageUrl,
  genre = "Drama",
  onMint,
  onDelete
}: FilmCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Fallback image or placeholder
  const displayImage = imageUrl || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80`;
  return;
};
export default FilmCard;