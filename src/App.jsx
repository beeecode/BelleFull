import React, { useEffect, useState, Suspense } from 'react';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { LogoLoader } from './components/common/LogoLoader';
import './styles/landing.css';

// Lazy load the pages for maximum performance and code splitting
const LandingPage = React.lazy(() => import('./pages/public/LandingPage'));
const FoodMenuPage = React.lazy(() => import('./pages/public/FoodMenuPage'));
const CheckoutPage = React.lazy(() => import('./pages/public/CheckoutPage'));
const AdminPage = React.lazy(() => import('./pages/admin/AdminPage'));
const OrderSuccessPage = React.lazy(() => import('./pages/public/OrderSuccessPage'));
const PaymentFailedPage = React.lazy(() => import('./pages/public/PaymentFailedPage'));

const PageLoader = () => (
  <div className="page-loader-shell">
    <LogoLoader text="Preparing your experience..." />
  </div>
);

export default function App() {
  const getPageFromLocation = () => {
    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/login') return 'admin';
    if (window.location.pathname === '/checkout') return 'checkout';
    if (window.location.pathname === '/menu') return 'menu';
    if (window.location.pathname === '/success') return 'success';
    if (window.location.pathname === '/payment-failed' || window.location.pathname === '/failed') return 'payment-failed';
    return 'landing';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromLocation);

  useEffect(() => {
    const normalizeMenuHash = () => {
      if (window.location.pathname === '/menu' && window.location.hash) {
        window.history.replaceState({}, '', '/menu');
      }
    };

    const handlePopState = () => {
      normalizeMenuHash();
      setCurrentPage(getPageFromLocation());
    };

    normalizeMenuHash();
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', normalizeMenuHash);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', normalizeMenuHash);
    };
  }, []);

  const navigateHome = (event) => {
    event?.preventDefault();
    window.history.pushState({}, '', '/');
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        return <CheckoutPage onNavigateHome={navigateHome} onNavigateMenu={navigateToMenu} />;
      case 'menu':
        return <FoodMenuPage onNavigateCheckout={navigateToCheckout} onNavigateHome={navigateHome} onNavigateMenu={navigateToMenu} />;
      case 'success':
        return <OrderSuccessPage onNavigateHome={navigateHome} onNavigateMenu={navigateToMenu} />;
      case 'payment-failed':
        return <PaymentFailedPage onNavigateCheckout={navigateToCheckout} onNavigateHome={navigateHome} onNavigateMenu={navigateToMenu} />;
      default:
        return <LandingPage onNavigateHome={navigateHome} onNavigateMenu={navigateToMenu} />;
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
