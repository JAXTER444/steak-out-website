import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import SteakOutFlame from "../imports/SteakOutFlame-8-34";
import { HeroCarousel } from "./HeroCarousel";

interface HomepageProps {
  onNavigateToMenu: () => void;
  onNavigateToAbout: () => void;
}

export function Homepage({ onNavigateToMenu, onNavigateToAbout }: HomepageProps) {
  return (
    <div className="h-screen relative overflow-hidden">
      {/* Fullscreen Carousel Background */}
      <div className="absolute inset-0">
        <HeroCarousel />
      </div>

      {/* Center - Steak-Out Branding */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white drop-shadow-2xl">
          {/* Logo */}
          <div className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48 mx-auto mb-6 filter drop-shadow-lg">
            <SteakOutFlame />
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight drop-shadow-lg mb-8">
            Steak-Out
          </h1>
          
          {/* Action Buttons */}
          <div className="flex flex-row gap-4 justify-center pointer-events-auto">
            <Button 
              onClick={onNavigateToMenu}
              className="text-white px-8 text-lg shadow-xl"
              style={{ backgroundColor: '#EE101A', paddingTop: '20px', paddingBottom: '20px' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d60e17'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EE101A'}
              size="lg"
            >
              View Our Menu
            </Button>
            <Button 
              onClick={onNavigateToAbout}
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-5 text-lg shadow-xl backdrop-blur-sm bg-white/10"
              size="lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}