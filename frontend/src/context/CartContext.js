import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, color = null, size = null) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id && i.color === color && i.size === size);
      if (existing) {
        return prev.map(i =>
          i._id === product._id && i.color === color && i.size === size
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 99) }
            : i
        );
      }
      return [...prev, { ...product, quantity, color, size }];
    });
  };

  const removeFromCart = (id, color, size) => {
    setCartItems(prev => prev.filter(i => !(i._id === id && i.color === color && i.size === size)));
  };

  const updateQuantity = (id, color, size, quantity) => {
    if (quantity <= 0) { removeFromCart(id, color, size); return; }
    setCartItems(prev => prev.map(i =>
      i._id === id && i.color === color && i.size === size ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
