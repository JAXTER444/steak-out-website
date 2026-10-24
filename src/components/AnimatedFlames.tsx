import { motion } from "motion/react";

export function AnimatedFlames() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multiple flame elements scattered across the background */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${(i * 8 + Math.random() * 10)}%`,
            bottom: `-20%`,
            width: `${80 + Math.random() * 100}px`,
            height: `${120 + Math.random() * 150}px`,
          }}
          animate={{
            y: [0, -window.innerHeight - 200],
            opacity: [0, 0.15, 0.08, 0],
            scale: [1, 1.2, 0.8, 0.6],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 100 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <filter id={`blur-${i}`}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
              </filter>
            </defs>
            {/* Outer flame - red */}
            <motion.path
              d="M50 10 C30 30, 20 60, 30 90 C35 110, 45 130, 50 140 C55 130, 65 110, 70 90 C80 60, 70 30, 50 10"
              fill="#EE101A"
              opacity="0.6"
              filter={`url(#blur-${i})`}
              animate={{
                d: [
                  "M50 10 C30 30, 20 60, 30 90 C35 110, 45 130, 50 140 C55 130, 65 110, 70 90 C80 60, 70 30, 50 10",
                  "M50 5 C25 35, 18 65, 28 95 C33 115, 43 135, 50 145 C57 135, 67 115, 72 95 C82 65, 75 35, 50 5",
                  "M50 15 C35 25, 22 58, 32 88 C37 108, 47 128, 50 138 C53 128, 63 108, 68 88 C78 58, 65 25, 50 15",
                  "M50 10 C30 30, 20 60, 30 90 C35 110, 45 130, 50 140 C55 130, 65 110, 70 90 C80 60, 70 30, 50 10",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Inner flame - orange */}
            <motion.path
              d="M50 25 C38 40, 35 55, 40 75 C43 88, 47 105, 50 115 C53 105, 57 88, 60 75 C65 55, 62 40, 50 25"
              fill="#FF6B35"
              opacity="0.5"
              filter={`url(#blur-${i})`}
              animate={{
                d: [
                  "M50 25 C38 40, 35 55, 40 75 C43 88, 47 105, 50 115 C53 105, 57 88, 60 75 C65 55, 62 40, 50 25",
                  "M50 20 C36 38, 33 58, 38 78 C41 91, 45 108, 50 118 C55 108, 59 91, 62 78 C67 58, 64 38, 50 20",
                  "M50 28 C40 42, 37 53, 42 73 C45 86, 48 103, 50 113 C52 103, 55 86, 58 73 C63 53, 60 42, 50 28",
                  "M50 25 C38 40, 35 55, 40 75 C43 88, 47 105, 50 115 C53 105, 57 88, 60 75 C65 55, 62 40, 50 25",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Core - yellow/white */}
            <motion.ellipse
              cx="50"
              cy="80"
              rx="8"
              ry="15"
              fill="#FFF4E6"
              opacity="0.4"
              filter={`url(#blur-${i})`}
              animate={{
                ry: [15, 18, 12, 15],
                opacity: [0.4, 0.6, 0.3, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
