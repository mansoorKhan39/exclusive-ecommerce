import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, toggleWishlist } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getWishlist().then(res => setWishlist(res.data)).catch(() => {});
    } else {
      setWishlist([]);
    }
  }, [user]);

  const toggleItem = async (product) => {
    if (!user) {
      toast.error('Please log in to use wishlist');
      return;
    }
    try {
      const res = await toggleWishlist(product._id);
      if (res.data.inWishlist) {
        setWishlist(prev => [...prev, product]);
        toast.success('Added to wishlist ❤️');
      } else {
        setWishlist(prev => prev.filter(i => i._id !== product._id));
        toast('Removed from wishlist');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const isInWishlist = (productId) => wishlist.some(i => i._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
};
