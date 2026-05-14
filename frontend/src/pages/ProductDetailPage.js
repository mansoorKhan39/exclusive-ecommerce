import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Minus, Plus, Truck, RotateCcw, Share2 } from 'lucide-react';
import { getProduct, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { StarRating } from '../components/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(res => {
        setProduct(res.data);
        setSelectedColor(res.data.colors?.[0] || null);
        setSelectedSize(res.data.sizes?.[0] || null);
        return getProducts({ category: res.data.category, limit: 4 });
      })
      .then(res => setRelated(res.data.products.filter(p => p._id !== id)))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center container"><div className="spinner" /></div>;
  if (!product) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Product not found. <Link to="/">Go Home</Link></div>;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.images?.length > 0
    ? product.images
    : [null, null, null, null];

  const imgUrl = (src) => src || `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    toast.success('Added to cart! 🛒');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    window.location.href = '/cart';
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span className="sep">/</span>
        <span className="current">{product.name}</span>
      </div>

      {/* Main */}
      <div className="product-detail-grid">
        {/* Images */}
        <div className="product-detail-images">
          <div className="product-thumbnails">
            {images.map((img, i) => (
              <button
                key={i}
                className={`thumb-btn ${selectedImg === i ? 'active' : ''}`}
                onClick={() => setSelectedImg(i)}
              >
                <img src={imgUrl(img)} alt={`${product.name} view ${i+1}`} />
              </button>
            ))}
          </div>
          <div className="product-main-image">
            <img src={imgUrl(images[selectedImg])} alt={product.name} />
            {discount > 0 && <span className="product-badge badge-red">-{discount}%</span>}
          </div>
        </div>

        {/* Info */}
        <div className="product-detail-info animate-fade-up">
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-rating-row">
            <StarRating rating={product.rating} numReviews={product.numReviews} />
            <span className="detail-stock" style={{ color: product.stock > 0 ? 'var(--secondary)' : 'var(--primary)' }}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="detail-price">
            ${product.price.toLocaleString()}
            {product.originalPrice > product.price && (
              <span className="detail-original-price">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <p className="detail-description">{product.description}</p>

          <div className="detail-divider" />

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="detail-option-row">
              <span className="detail-option-label">Colours:</span>
              <div className="detail-colors">
                {product.colors.map(c => (
                  <button
                    key={c}
                    className={`detail-color-btn ${selectedColor === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="detail-option-row">
              <span className="detail-option-label">Size:</span>
              <div className="detail-sizes">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`detail-size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="detail-buy-row">
            <div className="qty-control">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                <Minus size={16} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>
                <Plus size={16} />
              </button>
            </div>
            <button className="btn btn-primary" onClick={handleBuyNow} disabled={!product.stock}>Buy Now</button>
            <button
              className={`detail-wish-btn ${isInWishlist(product._id) ? 'active' : ''}`}
              onClick={() => toggleItem(product)}
            >
              <Heart size={20} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Add to cart */}
          <button className="btn btn-dark btn-full" onClick={handleAddToCart} disabled={!product.stock} style={{ marginTop: 12 }}>
            Add To Cart
          </button>

          {/* Delivery info */}
          <div className="detail-delivery">
            <div className="delivery-item">
              <Truck size={32} />
              <div>
                <h4>Free Delivery</h4>
                <p><a href="#">Enter your postal code for Delivery Availability</a></p>
              </div>
            </div>
            <div className="detail-divider" style={{ margin: '12px 0' }} />
            <div className="delivery-item">
              <RotateCcw size={32} />
              <div>
                <h4>Return Delivery</h4>
                <p>Free 30 Days Delivery Returns. <a href="#">Details</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ marginTop: 60 }}>
          <div className="section-tag"><div className="section-tag-bar" /><span className="section-tag-text">Related Item</span></div>
          <div className="grid-4" style={{ marginTop: 24 }}>
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
