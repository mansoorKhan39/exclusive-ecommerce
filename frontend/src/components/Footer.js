import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-col">
            <h3 className="footer-brand">Exclusive</h3>
            <p className="footer-col-title">Subscribe</p>
            <p className="footer-desc">Get 10% off your first order</p>
            <form className="footer-subscribe" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="footer-email-input"
                required
              />
              <button type="submit" className="footer-subscribe-btn"><Send size={16} /></button>
            </form>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <address className="footer-address">
              111 Bijoy sarani, Dhaka,<br />DH 1515, Bangladesh.
            </address>
            <a href="mailto:exclusive@gmail.com" className="footer-link">exclusive@gmail.com</a>
            <a href="tel:+8801588888-9999" className="footer-link">+88015-88888-9999</a>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <ul className="footer-links">
              <li><Link to="/account" className="footer-link">My Account</Link></li>
              <li><Link to="/login" className="footer-link">Login / Register</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
              <li><Link to="/wishlist" className="footer-link">Wishlist</Link></li>
              <li><Link to="/shop" className="footer-link">Shop</Link></li>
            </ul>
          </div>

          {/* Quick Link */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Link</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/" className="footer-link">Terms Of Use</Link></li>
              <li><Link to="/" className="footer-link">FAQ</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Download App */}
          <div className="footer-col">
            <h4 className="footer-col-title">Download App</h4>
            <p className="footer-app-note">Save $3 with App New User Only</p>
            <div className="footer-app-badges">
              <div className="footer-qr" />
              <div className="footer-store-links">
                <div className="footer-store-btn">Google Play</div>
                <div className="footer-store-btn">App Store</div>
              </div>
            </div>
            <div className="footer-social">
              <a href="#" className="footer-social-icon"><Facebook size={20} /></a>
              <a href="#" className="footer-social-icon"><Twitter size={20} /></a>
              <a href="#" className="footer-social-icon"><Instagram size={20} /></a>
              <a href="#" className="footer-social-icon"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© Copyright Rimel 2022. All right reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
