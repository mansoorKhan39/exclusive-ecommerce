import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingCart, User, Search, Menu, X, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import './Navbar.css';

const categories = [
  "Women's Fashion","Men's Fashion","Electronics","Home & Lifestyle",
  "Groceries & Pets","Medicine","Sports & Outdoor","Baby's & Toys","Health & Beauty"
];

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const accountRef = useRef();
  const catRef = useRef();

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
    setCatOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">Exclusive</Link>

        {/* Desktop Nav */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          {!user && <Link to="/signup" className={`nav-link ${isActive('/signup') ? 'active' : ''}`}>Sign Up</Link>}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="navbar-search-input"
            />
            <button type="submit" className="navbar-search-btn">
              <Search size={18} />
            </button>
          </form>

          {/* Wishlist */}
          <Link to="/wishlist" className="navbar-icon-btn">
            <Heart size={22} />
            {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="navbar-icon-btn">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </Link>

          {/* Account */}
          {user ? (
            <div className="nav-account" ref={accountRef}>
              <button
                className="navbar-icon-btn nav-user-btn"
                onClick={() => setAccountOpen(o => !o)}
              >
                <div className="nav-avatar">{user.firstName?.[0]?.toUpperCase()}</div>
              </button>
              {accountOpen && (
                <div className="nav-dropdown account-dropdown animate-fade-in">
                  <Link to="/account" className="nav-dropdown-item">
                    <User size={15} /> My Profile
                  </Link>
                  <Link to="/account?tab=orders" className="nav-dropdown-item">
                    <Package size={15} /> My Orders
                  </Link>
                  <Link to="/account?tab=wishlist" className="nav-dropdown-item">
                    <Heart size={15} /> My Wishlist
                  </Link>
                  <Link to="/account?tab=settings" className="nav-dropdown-item">
                    <Settings size={15} /> Settings
                  </Link>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-icon-btn">
              <User size={22} />
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="navbar-menu-toggle" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Category sidebar (desktop) */}
      <div className="navbar-category-row container" style={{ display: 'none' }}>
        {/* Reserved for future use */}
      </div>
    </nav>
  );
};

export default Navbar;
