import { useEffect, useState } from 'react';
import { AdminPage } from './pages/AdminPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { FoodMenuPage } from './pages/FoodMenuPage';
import { LandingPage } from './pages/LandingPage';
import './styles/landing.css';

export default function App() {
  const getPageFromLocation = () => {
    if (window.location.pathname === '/admin') return 'admin';
    if (window.location.pathname === '/checkout') return 'checkout';
    if (window.location.pathname === '/menu') return 'menu';
    return 'landing';
  };
  const [currentPage, setCurrentPage] = useState(getPageFromLocation);
  const [cartItems, setCartItems] = useState([]);

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

  const addToCart = (food, amount = 1) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === food.id);

      if (!existingItem) {
        return [...currentItems, { ...food, quantity: amount }];
      }

      return currentItems.map((item) =>
        item.id === food.id ? { ...item, quantity: item.quantity + amount } : item,
      );
    });
  };

  const updateCartQuantity = (foodId, quantity) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.id === foodId ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (foodId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== foodId));
  };

  const clearCart = () => setCartItems([]);

  if (currentPage === 'admin') {
    return <AdminPage />;
  }

  if (currentPage === 'checkout') {
    return (
      <CheckoutPage
        cartItems={cartItems}
        onClearCart={clearCart}
        onNavigateMenu={navigateToMenu}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
      />
    );
  }

  if (currentPage === 'menu') {
    return (
      <FoodMenuPage
        cartItems={cartItems}
        onAddToCart={addToCart}
        onNavigateCheckout={navigateToCheckout}
      />
    );
  }

  return <LandingPage onNavigateMenu={navigateToMenu} />;
}
