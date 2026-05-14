import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const shipping = cartTotal > 140 ? 0 : (cartItems.length > 0 ? 10 : 0);
  const total = cartTotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'EXCLUSIVE10') {
      const disc = cartTotal * 0.1;
      setDiscount(disc);
      toast.success('Coupon applied! 10% off');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (!user) { toast.error('Please log in to checkout'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container cart-empty">
        <div className="cart-empty-icon"><ShoppingBag size={80} /></div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="breadcrumb">
        <Link to="/">Home</Link><span className="sep">/</span><span className="current">Cart</span>
      </div>

      <div className="cart-layout">
        {/* Table */}
        <div className="cart-table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={`${item._id}-${item.color}-${item.size}`}>
                  <td>
                    <div className="cart-product-info">
                      <div className="cart-product-img-wrap">
                        <button className="cart-remove-btn" onClick={() => removeFromCart(item._id, item.color, item.size)}>
                          <Trash2 size={14} />
                        </button>
                        <img
                          src={item.images?.[0] || `https://via.placeholder.com/64?text=${encodeURIComponent(item.name)}`}
                          alt={item.name}
                        />
                      </div>
                      <div>
                        <p className="cart-product-name">{item.name}</p>
                        {item.color && <p className="cart-product-variant">Color: {item.color}</p>}
                        {item.size && <p className="cart-product-variant">Size: {item.size}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="cart-price">${item.price.toLocaleString()}</td>
                  <td>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, item.color, item.size, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{String(item.quantity).padStart(2, '0')}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, item.color, item.size, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="cart-subtotal">${(item.price * item.quantity).toLocaleString()}</td>
                  <td>
                    <button className="cart-remove-icon" onClick={() => removeFromCart(item._id, item.color, item.size)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-actions">
            <Link to="/shop" className="btn btn-outline">Return To Shop</Link>
            <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <div className="coupon-row">
            <input
              type="text" placeholder="Coupon Code" value={coupon}
              onChange={e => setCoupon(e.target.value)} className="input"
            />
            <button className="btn btn-primary" onClick={applyCoupon}>Apply Coupon</button>
          </div>

          <div className="cart-total-box">
            <h3>Cart Total</h3>
            <div className="cart-total-rows">
              <div className="cart-total-row">
                <span>Subtotal:</span><span>${cartTotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="cart-total-row discount">
                  <span>Discount (EXCLUSIVE10):</span><span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="cart-total-row">
                <span>Shipping:</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              <div className="cart-total-divider" />
              <div className="cart-total-row total">
                <span>Total:</span><span>${total.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-full" onClick={handleCheckout}>
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
