import { ImageWithFallback } from "./figma/ImageWithFallback";
import SteakOutFlame from "../imports/SteakOutFlame-8-34";

interface AboutPageProps {
  onNavigateToMenu: () => void;
}

export function AboutPage({ onNavigateToMenu }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white pt-[-32px] pr-[0px] pb-[0px] pl-[0px]">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1561553521-b6cddc085c5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3RlYWslMjBncmlsbCUyMGZsYW1lcyUyMGZpcmV8ZW58MXx8fHwxNzczMjUyMTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Premium raw steak with rosemary"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-4xl">
            <div className="w-20 h-28 md:w-24 md:h-32 mx-auto mb-6 filter drop-shadow-lg">
              <SteakOutFlame />
            </div>
            <h1 className="text-5xl md:text-7xl font-medium mb-4 drop-shadow-lg">About Steak-Out</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              A family-owned business built on passion, quality, and community
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium mb-6 text-gray-900">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Steak-Out is a small family-owned business that started during lockdown out of a simple passion for meat and braaing the perfect steak. What began as a love for quality cuts and good food grew into a brand dedicated to providing top-quality products to fellow meat lovers.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                We proudly sell AAA-grade beef that is carefully selected to ensure excellent flavour and tenderness. For your convenience, all our meat is vacuum sealed, making it easy to store and prepare whenever you are ready to cook. Our beef patties are gluten-free and include chia seeds, a well-known superfood that adds nutritional value while maintaining great taste.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                In addition to our meat products, we also offer TriBeCa coffee, hot chocolate, and Freezo, which are available to order throughout the week.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Community is very important to us. We always appreciate it when our customers tell their friends about Steak-Out and help share our brand. We are also open to collaborating with other high-quality small businesses and enjoy promoting relevant products that align with our values.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1759382904778-6994716b1aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGluZyUyMHN0ZWFrJTIwYmFyYmVjdWUlMjBvdXRkb29yfGVufDF8fHx8MTc3MzI1MTk0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Chef preparing premium steak"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-24">
            <h2 className="text-4xl md:text-5xl font-medium mb-16 text-gray-900 text-center tracking-tight">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 shadow-md relative z-10" style={{ backgroundColor: '#EE101A' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-[#EE101A] transition-colors duration-300 relative z-10">AAA-Grade Quality</h3>
                <p className="text-gray-600 leading-relaxed text-lg relative z-10">
                  Every cut is carefully selected AAA-grade beef to ensure excellent flavour and tenderness in every bite.
                </p>
              </div>
              <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 shadow-md relative z-10" style={{ backgroundColor: '#EE101A' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-[#EE101A] transition-colors duration-300 relative z-10">Passion & Community</h3>
                <p className="text-gray-600 leading-relaxed text-lg relative z-10">
                  Built on a love for braaing the perfect steak and bringing people together around good food.
                </p>
              </div>
              <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 shadow-md relative z-10" style={{ backgroundColor: '#EE101A' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-[#EE101A] transition-colors duration-300 relative z-10">Vacuum Sealed Fresh</h3>
                <p className="text-gray-600 leading-relaxed text-lg relative z-10">
                  All meat is vacuum sealed for your convenience, making it easy to store and prepare whenever you're ready.
                </p>
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden order-2 md:order-1">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-48 h-64 md:w-64 md:h-80">
                  <SteakOutFlame />
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-medium mb-6 text-gray-900">
                Quality You Can Trust
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#EE101A' }}>
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-gray-900">AAA-Grade Beef</h3>
                    <p className="text-gray-600">We proudly sell AAA-grade beef, carefully selected to ensure excellent flavour and tenderness.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#EE101A' }}>
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-gray-900">Vacuum Sealed</h3>
                    <p className="text-gray-600">All meat is vacuum sealed for easy storage and preparation whenever you're ready to cook.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#EE101A' }}>
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-gray-900">Gluten-Free Patties</h3>
                    <p className="text-gray-600">Our beef patties are gluten-free and include chia seeds, a superfood that adds nutrition while maintaining great taste.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: '#EE101A' }}>
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-gray-900">More Than Meat</h3>
                    <p className="text-gray-600">We also offer TriBeCa coffee, hot chocolate, and Freezo, available to order throughout the week.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #EE101A 0%, #a40b12 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight drop-shadow-sm">
            Experience the Prime Difference
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            Steak-Out is built on quality, passion, and a love for bringing people together around exceptional food.
          </p>
          <button
            type="button"
            onClick={onNavigateToMenu}
            className="group px-10 py-4 bg-white rounded-full text-lg font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:-translate-y-1 inline-flex items-center justify-center"
            style={{ color: '#EE101A' }}
          >
            Browse Our Selection
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-3 text-xl leading-none">&rarr;</span>
          </button>
        </div>
      </section>
    </div>
  );
}