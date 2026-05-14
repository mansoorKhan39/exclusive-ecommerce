import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const StarRating = ({ rating, numReviews }) => (
  <div className="product-rating">
    <div className="stars">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={13} fill={s <= Math.round(rating) ? '#f5a623' : 'none'} color={s <= Math.round(rating) ? '#f5a623' : '#ddd'} />
      ))}
    </div>
    {numReviews !== undefined && <span className="review-count">({numReviews})</span>}
  </div>
);

const ProductCard = ({ product, style = {} }) => {
  const { addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  const inWishlist = isInWishlist(product._id);
  const imageUrl = product.images?.[0] || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`;

  return (
    <div className="product-card" style={style}>
      <Link to={`/product/${product._id}`} className="product-card-link">
        <div className="product-image-wrap">
          {discount > 0 && <span className="product-badge badge-red">-{discount}%</span>}
          {product.isNew && !discount && <span className="product-badge badge-green">NEW</span>}
          <img src={imageUrl} alt={product.name} className="product-img" loading="lazy" />
          <div className="product-actions">
            <button className={`product-action-btn ${inWishlist ? 'active' : ''}`} onClick={handleWishlist} title="Add to wishlist">
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <Link to={`/product/${product._id}`} className="product-action-btn" title="Quick view">
              <Eye size={18} />
            </Link>
          </div>
          <button className="product-add-cart" onClick={handleAddToCart}>
            <ShoppingCart size={15} /> Add To Cart
          </button>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price-row">
            <span className="product-price">${product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="product-original-price">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <StarRating rating={product.rating} numReviews={product.numReviews} />
          {product.colors?.length > 0 && (
            <div className="product-colors">
              {product.colors.map(c => (
                <span key={c} className="color-dot" style={{ background: c }} title={c} />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
export { StarRating };
