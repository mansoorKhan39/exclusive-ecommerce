import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveAllToBag = () => {
    wishlist.forEach(p => addToCart(p, 1));
    toast.success('All items added to cart!');
  };

  if (wishlist.length === 0) {
    return (
      <div className="container wishlist-empty">
        <div className="wishlist-empty-icon"><Heart size={80} /></div>
        <h2>Your wishlist is empty</h2>
        <p>Save items you love to your wishlist.</p>
        <Link to="/shop" className="btn btn-primary btn-lg">Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="wishlist-header">
        <h2>Wishlist ({wishlist.length})</h2>
        <button className="btn btn-outline" onClick={moveAllToBag}>Move All To Bag</button>
      </div>

      <div className="grid-4">
        {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
      </div>

      {/* Just For You */}
      <div className="section-tag" style={{ marginTop: 60, marginBottom: 24 }}>
        <div className="section-tag-bar" />
        <span className="section-tag-text">Just For You</span>
        <Link to="/shop" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>See All</Link>
      </div>
    </div>
  );
};

export default WishlistPage;
