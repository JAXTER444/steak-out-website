import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Special {
  id: number;
  name: string;
  description: string;
  originalPrice: string;
  specialPrice: string;
  image: string;
  badge: string;
}

/** Local file in `public/home/` — encodes spaces for URLs */
function homeImage(filename: string) {
  return `/home/${encodeURIComponent(filename)}`;
}

const specials: Special[] = [
  {
    id: 1,
    name: "Rump",
    description: "AAA-grade rump — tender, flavourful, and perfect for the braai",
    originalPrice: "R255",
    specialPrice: "R255",
    image: "https://images.unsplash.com/photo-1682159173065-2b49ffd61adb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3RlYWslMjByaWJleWV8ZW58MXx8fHwxNzY4OTIxMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "BEST SELLER"
  },
  {
    id: 2,
    name: "Chicken Flatty",
    description: "Tender, flavourful chicken — perfect for the braai or a quick weeknight meal",
    originalPrice: "R99",
    specialPrice: "R89",
    image: homeImage("Chicken flatty.png"),
    badge: "CHEF'S PICK"
  },
  {
    id: 3,
    name: "Pork Espetada",
    description: "Succulent pork skewers, marinated and ready to grill",
    originalPrice: "R190",
    specialPrice: "R170",
    image: homeImage("Pork Espetada.png"),
    badge: "LIMITED TIME"
  },
  {
    id: 4,
    name: "TriBeCa Espresso Capsules",
    description: "Premium Italian espresso capsules for a rich, authentic cup at home",
    originalPrice: "R520",
    specialPrice: "R480",
    image: homeImage("tribeca home.png"),
    badge: "PREMIUM"
  }
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % specials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + specials.length) % specials.length);
  };

  const current = specials[currentIndex];

  return (
    <div className="relative h-full">
      {/* Carousel Container */}
      <div className="relative h-full overflow-hidden bg-white shadow-2xl">
        {/* Image Background with Content Overlay */}
        <div className="relative h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
            </motion.div>
          </AnimatePresence>

          {/* Content Overlay */}
          <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Badge */}
                <div className="mb-4">
                  <span 
                    className="px-4 py-2 text-white text-sm font-medium rounded-full inline-block"
                    style={{ backgroundColor: '#EE101A' }}
                  >
                    {current.badge}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-3 text-white">
                  {current.name}
                </h3>
                <p className="text-white/90 mb-6 text-base md:text-lg max-w-lg">
                  {current.description}
                </p>
                
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl md:text-4xl font-medium text-white">
                    {current.specialPrice}
                  </span>
                  {current.originalPrice !== current.specialPrice && (
                    <span className="text-xl md:text-2xl text-white/60 line-through">
                      {current.originalPrice}
                    </span>
                  )}
                  <span className="text-sm text-white/80">1kg</span>
                </div>

                <p className="text-white/70 text-sm uppercase tracking-wide">
                  This Week's Special
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="Previous special"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg items-center justify-center hover:bg-white transition-colors z-10"
        aria-label="Next special"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {specials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-6 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}