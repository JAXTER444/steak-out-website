import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { useConvexAuth } from 'convex/react';
import { CartProvider } from './contexts/CartContext';
import { Navigation } from './components/Navigation';
import { Homepage } from './components/Homepage';
import { MenuPage } from './components/MenuPage';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage, type PlacedOrderSummary } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { OrdersPage } from './components/OrdersPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [lastOrder, setLastOrder] = useState<PlacedOrderSummary | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigateToMenu = () => {
    setCurrentPage('menu');
  };

  const handleNavigateToAbout = () => {
    setCurrentPage('about');
  };

  const handleNavigateToContact = () => {
    setCurrentPage('contact');
  };

  const handleNavigateToCart = () => {
    setCurrentPage('cart');
  };

  const handleNavigateToCheckout = () => {
    setCurrentPage('checkout');
  };

  const handleNavigateToOrders = () => {
    setCurrentPage('orders');
  };

  const handleOrderPlaced = (order: PlacedOrderSummary) => {
    setLastOrder(order);
    setCurrentPage('orderConfirmation');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigateToMenu={handleNavigateToMenu} onNavigateToAbout={handleNavigateToAbout} />;
      case 'menu':
        return <MenuPage onNavigateToContact={handleNavigateToContact} />;
      case 'about':
        return <AboutPage onNavigateToMenu={handleNavigateToMenu} />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
        return (
          <CartPage
            onNavigateToMenu={handleNavigateToMenu}
            onNavigateToCheckout={handleNavigateToCheckout}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            onNavigateToCart={handleNavigateToCart}
            onOrderPlaced={handleOrderPlaced}
          />
        );
      case 'orderConfirmation':
        if (!lastOrder) {
          return (
            <CartPage
              onNavigateToMenu={handleNavigateToMenu}
              onNavigateToCheckout={handleNavigateToCheckout}
            />
          );
        }
        return (
          <OrderConfirmationPage
            order={lastOrder}
            onNavigateToMenu={handleNavigateToMenu}
            onNavigateToOrders={handleNavigateToOrders}
            showOrdersLink={isAuthenticated}
          />
        );
      case 'orders':
        return (
          <OrdersPage
            onNavigateToMenu={handleNavigateToMenu}
            onOpenLogin={() => setAuthDialogOpen(true)}
          />
        );
      default:
        return <Homepage onNavigateToMenu={handleNavigateToMenu} onNavigateToAbout={handleNavigateToAbout} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Toaster position="top-center" richColors />
        <Navigation
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          authDialogOpen={authDialogOpen}
          onAuthDialogOpenChange={setAuthDialogOpen}
          onNavigateToOrders={handleNavigateToOrders}
        />
        {renderCurrentPage()}
      </div>
    </CartProvider>
  );
}
