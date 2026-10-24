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

const specials: Special[] = [
  {
    id: 1,
    name: "Premium Ribeye",
    description: "USDA Prime ribeye with perfect marbling, aged 28 days for maximum tenderness and flavor",
    originalPrice: "$45.99",
    specialPrice: "$34.99",
    image: "https://images.unsplash.com/photo-1682159173065-2b49ffd61adb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3RlYWslMjByaWJleWV8ZW58MXx8fHwxNzY4OTIxMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "BEST SELLER"
  },
  {
    id: 2,
    name: "Tomahawk Steak",
    description: "Show-stopping 40oz bone-in ribeye, perfect for special occasions and impressing guests",
    originalPrice: "$89.99",
    specialPrice: "$69.99",
    image: "https://images.unsplash.com/photo-1690983322475-29a61c585204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21haGF3ayUyMHN0ZWFrJTIwZ3JpbGxlZHxlbnwxfHx8fDE3Njg5MjExNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "CHEF'S PICK"
  },
  {
    id: 3,
    name: "Filet Mignon",
    description: "The most tender cut available, center-cut from premium beef tenderloin",
    originalPrice: "$52.99",
    specialPrice: "$39.99",
    image: "https://images.unsplash.com/photo-1607116176195-b81b1f41f536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxldCUyMG1pZ25vbiUyMHN0ZWFrfGVufDF8fHx8MTc2ODg0NTQ1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "LIMITED TIME"
  },
  {
    id: 4,
    name: "Dry-Aged Beef",
    description: "45-day dry-aged New York strip with intense, concentrated beef flavor",
    originalPrice: "$64.99",
    specialPrice: "$49.99",
    image: "https://images.unsplash.com/photo-1603048374877-b98f840ad441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcnklMjBhZ2VkJTIwYmVlZnxlbnwxfHx8fDE3Njg5MjExNDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "PREMIUM"
  }
];

export function WeeklySpecialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % specials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + specials.length) % specials.length);
  };

  const current = specials[currentIndex];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900">
            This Week's Specials
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hand-selected premium cuts at exceptional prices. Available for a limited time only.
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <ImageWithFallback
                      src={current.image}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-6 left-6">
                      <span 
                        className="px-4 py-2 text-white text-sm font-medium rounded-full"
                        style={{ backgroundColor: '#EE101A' }}
                      >
                        {current.badge}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-3xl md:text-4xl font-medium mb-4 text-gray-900">
                      {current.name}
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {current.description}
                    </p>
                    
                    <div className="flex items-baseline gap-4 mb-8">
                      <span className="text-4xl font-medium" style={{ color: '#EE101A' }}>
                        {current.specialPrice}
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        {current.originalPrice}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">per lb</span>
                    </div>

                    <button
                      className="px-8 py-4 text-white rounded-lg text-lg font-medium transition-all hover:shadow-lg"
                      style={{ backgroundColor: '#EE101A' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d60e17'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EE101A'}
                    >
                      Order Now
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous special"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Next special"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {specials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                style={index === currentIndex ? { backgroundColor: '#EE101A' } : {}}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
