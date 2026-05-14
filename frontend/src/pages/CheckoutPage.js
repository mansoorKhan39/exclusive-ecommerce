import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [form, setForm] = useState({
    firstName: '', companyName: '', streetAddress: '',
    apartment: '', town: '', phone: '', email: '',
    saveInfo: true,
  });

  const shipping = cartTotal > 140 ? 0 : 10;
  const total = cartTotal - discount + shipping;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'EXCLUSIVE10') {
      setDiscount(cartTotal * 0.1);
      toast.success('Coupon applied! 10% off');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems.length) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: {
          firstName: form.firstName, companyName: form.companyName,
          streetAddress: form.streetAddress, apartment: form.apartment,
          town: form.town, phone: form.phone, email: form.email,
        },
        paymentMethod,
        couponCode: coupon.toUpperCase() === 'EXCLUSIVE10' ? coupon : undefined,
      };
      const res = await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="breadcrumb">
        <Link to="/">Account</Link><span className="sep">/</span>
        <Link to="/account">My Account</Link><span className="sep">/</span>
        <Link to="/shop">Product</Link><span className="sep">/</span>
        <Link to="/cart">View Cart</Link><span className="sep">/</span>
        <span className="current">CheckOut</span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-main)', fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Billing Details</h1>

      <form onSubmit={handleSubmit} className="checkout-layout">
        {/* Billing Form */}
        <div className="billing-form">
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">First Name<span className="required">*</span></label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input name="companyName" value={form.companyName} onChange={handleChange} className="input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Street Address<span className="required">*</span></label>
            <input name="streetAddress" value={form.streetAddress} onChange={handleChange} className="input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Apartment, floor, etc. (optional)</label>
            <input name="apartment" value={form.apartment} onChange={handleChange} className="input" />
          </div>
          <div className="form-group">
            <label className="form-label">Town/City<span className="required">*</span></label>
            <input name="town" value={form.town} onChange={handleChange} className="input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number<span className="required">*</span></label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input" type="tel" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address<span className="required">*</span></label>
            <input name="email" value={form.email} onChange={handleChange} className="input" type="email" required />
          </div>
          <label className="form-checkbox">
            <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={handleChange} />
            <span>Save this information for faster check-out next time</span>
          </label>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          {/* Items */}
          <div className="order-items">
            {cartItems.map(item => (
              <div key={`${item._id}-${item.color}-${item.size}`} className="order-item">
                <div className="order-item-img">
                  <img src={item.images?.[0] || `https://via.placeholder.com/64?text=${encodeURIComponent(item.name)}`} alt={item.name} />
                  <span className="order-item-qty">{item.quantity}</span>
                </div>
                <span className="order-item-name">{item.name}</span>
                <span className="order-item-price">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="order-totals">
            <div className="order-total-row">
              <span>Subtotal:</span><span>${cartTotal.toLocaleString()}</span>
            </div>
            <div className="order-divider" />
            <div className="order-total-row">
              <span>Shipping:</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
            </div>
            {discount > 0 && (
              <>
                <div className="order-divider" />
                <div className="order-total-row" style={{ color: 'var(--secondary)' }}>
                  <span>Discount:</span><span>-${discount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="order-divider" />
            <div className="order-total-row" style={{ fontWeight: 700, fontSize: 16 }}>
              <span>Total:</span><span>${total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="payment-methods">
            <label className="payment-option">
              <input
                type="radio" name="payment" value="bank"
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
              />
              <span>Bank</span>
              <div className="payment-icons">
                <span className="pay-icon">💳</span>
                <span className="pay-icon">🏦</span>
              </div>
            </label>
            <label className="payment-option">
              <input
                type="radio" name="payment" value="cash_on_delivery"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={() => setPaymentMethod('cash_on_delivery')}
              />
              <span>Cash on delivery</span>
            </label>
          </div>

          {/* Coupon */}
          <div className="checkout-coupon">
            <input
              type="text" placeholder="Coupon Code" value={coupon}
              onChange={e => setCoupon(e.target.value)} className="input"
            />
            <button type="button" className="btn btn-primary" onClick={applyCoupon}>Apply Coupon</button>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
