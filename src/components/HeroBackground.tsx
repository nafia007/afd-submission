
import { useEffect, useState } from 'react';

const HeroBackground = () => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => {
      setImageError(true);
      setLoaded(true); // Still show the component even if image fails
    };
    img.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80";
  }, []);

  return (
    <div className="absolute inset-0 w-full h-screen overflow-hidden">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>
      
      {/* Horizontal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10"></div>
      
      {/* Hero image or fallback */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {!imageError ? (
          <img 
            src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80"
            className="w-full h-full object-cover object-center filter brightness-50"
            alt="Hero background"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        )}
      </div>
      
      {/* Animated gradient elements */}
      <div className="absolute inset-0 opacity-30 z-10">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-red-700/20 blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-800/20 blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default HeroBackground;
