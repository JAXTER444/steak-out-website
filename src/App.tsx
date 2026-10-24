import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { CartProvider } from './contexts/CartContext';
import { Navigation } from './components/Navigation';
import { Homepage } from './components/Homepage';
import { MenuPage } from './components/MenuPage';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { CartPage } from './components/CartPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigateToMenu = () => {
    setCurrentPage('menu');
  };

  const handleNavigateToAbout = () => {
    setCurrentPage('about');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigateToMenu={handleNavigateToMenu} onNavigateToAbout={handleNavigateToAbout} />;
      case 'menu':
        return <MenuPage />;
      case 'about':
        return <AboutPage onNavigateToMenu={handleNavigateToMenu} />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
        return <CartPage onNavigateToMenu={handleNavigateToMenu} />;
      default:
        return <Homepage onNavigateToMenu={handleNavigateToMenu} onNavigateToAbout={handleNavigateToAbout} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Toaster position="top-center" richColors />
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        {renderCurrentPage()}
      </div>
    </CartProvider>
  );
}