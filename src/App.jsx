import React, { useEffect, useState, Suspense } from 'react';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import './styles/landing.css';

// Lazy load the pages for maximum performance and code splitting
const LandingPage = React.lazy(() => import('./pages/public/LandingPage'));
const FoodMenuPage = React.lazy(() => import('./pages/public/FoodMenuPage'));
const CheckoutPage = React.lazy(() => import('./pages/public/CheckoutPage'));
const AdminPage = React.lazy(() => import('./pages/admin/AdminPage'));
const OrderSuccessPage = React.lazy(() => import('./pages/public/OrderSuccessPage'));

const PageLoader = () => (
  <div className="food-empty-state" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p>Loading...</p>
  </div>
);

export default function App() {
  const getPageFromLocation = () => {
    if (window.location.pathname === '/admin') return 'admin';
    if (window.location.pathname === '/checkout') return 'checkout';
    if (window.location.pathname === '/menu') return 'menu';
    if (window.location.pathname === '/success') return 'success';
    return 'landing';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromLocation);

  useEffect(() => {
    const handlePopState = () => setCurrentPage(getPageFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToMenu = (event) => {
    event?.preventDefault();
    window.history.pushState({}, '', '/menu');
    setCurrentPage('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = (event) => {
    event?.preventDefault();
    window.history.pushState({}, '', '/checkout');
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminPage />;
      case 'checkout':
        return <CheckoutPage onNavigateMenu={navigateToMenu} />;
      case 'menu':
        return <FoodMenuPage onNavigateCheckout={navigateToCheckout} />;
      case 'success':
        return <OrderSuccessPage onNavigateMenu={navigateToMenu} />;
      default:
        return <LandingPage onNavigateMenu={navigateToMenu} />;
    }
  };

  return (
    <CartProvider>
      <AdminProvider>
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </AdminProvider>
    </CartProvider>
  );
}
