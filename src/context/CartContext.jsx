import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food, amount = 1) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === food.id);

      if (!existingItem) {
        return [...currentItems, { ...food, quantity: amount }];
      }

      return currentItems.map((item) =>
        item.id === food.id ? { ...item, quantity: item.quantity + amount } : item
      );
    });
  };

  const updateCartQuantity = (foodId, quantity) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.id === foodId ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== foodId));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    cartCount,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
