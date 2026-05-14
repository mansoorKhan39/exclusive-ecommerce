import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { User, Package, Heart, Settings, MapPin, CreditCard, RotateCcw, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, getMyOrders } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import './AccountPage.css';

const ProfileTab = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-tab animate-fade-up">
      <h2 className="tab-title">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="input" />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="input" />
          </div>
        </div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="input" type="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="input" />
          </div>
        </div>
        <div className="profile-section-title">Password Changes</div>
        <div className="form-group">
          <input name="currentPassword" value={form.currentPassword} onChange={handleChange}
            className="input" type="password" placeholder="Current Password" />
        </div>
        <div className="form-group">
          <input name="newPassword" value={form.newPassword} onChange={handleChange}
            className="input" type="password" placeholder="New Password" />
        </div>
        <div className="form-group">
          <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
            className="input" type="password" placeholder="Confirm New Password" />
        </div>
        <div className="profile-form-actions">
          <button type="button" className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = {
    pending: '#f5a623', processing: '#2196F3', shipped: '#9C27B0',
    delivered: '#00b517', cancelled: '#DB4444', refunded: '#607D8B',
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  if (orders.length === 0) return (
    <div className="orders-empty">
      <Package size={60} />
      <h3>No orders yet</h3>
      <p>When you place orders, they'll appear here.</p>
      <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div className="orders-tab animate-fade-up">
      <h2 className="tab-title">My Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="order-status-badge" style={{ background: statusColor[order.status] || '#999' }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="order-card-items">
              {order.items?.map(item => (
                <div key={item._id} className="order-card-item">
                  <img src={item.image || `https://via.placeholder.com/48?text=${encodeURIComponent(item.name)}`} alt={item.name} />
                  <div>
                    <p className="order-item-name">{item.name}</p>
                    <p className="order-item-meta">Qty: {item.quantity} × ${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-card-footer">
              <span className="order-total">Total: <strong>${order.total?.toLocaleString()}</strong></span>
              <span className="order-payment">{order.paymentMethod === 'cash_on_delivery' ? '💵 Cash on Delivery' : '🏦 Bank'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WishlistTabContent = () => {
  const { wishlist } = useWishlist();
  if (!wishlist.length) return (
    <div className="orders-empty">
      <Heart size={60} />
      <h3>Your wishlist is empty</h3>
      <Link to="/shop" className="btn btn-primary">Browse Products</Link>
    </div>
  );
  return (
    <div className="animate-fade-up">
      <h2 className="tab-title">My Wishlist</h2>
      <div className="grid-4">{wishlist.map(p => <ProductCard key={p._id} product={p} />)}</div>
    </div>
  );
};

const TABS = [
  { id: 'profile', label: 'My Profile', icon: <User size={16} /> },
  { id: 'address', label: 'Address Book', icon: <MapPin size={16} /> },
  { id: 'payment', label: 'My Payment Options', icon: <CreditCard size={16} /> },
  { id: 'orders', label: 'My Orders', icon: <Package size={16} />, group: 'My Orders' },
  { id: 'returns', label: 'My Returns', icon: <RotateCcw size={16} /> },
  { id: 'cancellations', label: 'My Cancellations', icon: <XCircle size={16} /> },
  { id: 'wishlist', label: 'My WishList', icon: <Heart size={16} />, group: 'My WishList' },
];

const AccountPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const setTab = (tab) => setSearchParams({ tab });

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'orders': return <OrdersTab />;
      case 'wishlist': return <WishlistTabContent />;
      default: return (
        <div className="tab-placeholder animate-fade-up">
          <h2 className="tab-title">{TABS.find(t => t.id === activeTab)?.label}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>This section is coming soon.</p>
        </div>
      );
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="account-header-row">
        <div className="breadcrumb" style={{ marginBottom: 0 }}>
          <Link to="/">Home</Link><span className="sep">/</span><span className="current">My Account</span>
        </div>
        <p className="account-welcome">Welcome! <strong style={{ color: 'var(--primary)' }}>{user?.firstName} {user?.lastName}</strong></p>
      </div>

      <div className="account-layout">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="sidebar-section">
            <p className="sidebar-group-title">Manage My Account</p>
            {TABS.filter(t => !t.group).map(tab => (
              <button
                key={tab.id}
                className={`sidebar-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div className="sidebar-section">
            <p className="sidebar-group-title">My Orders</p>
            {TABS.filter(t => t.group === 'My Orders').map(tab => (
              <button
                key={tab.id}
                className={`sidebar-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
            <button
              className={`sidebar-tab-btn ${activeTab === 'returns' ? 'active' : ''}`}
              onClick={() => setTab('returns')}
            >
              <RotateCcw size={16} /> My Returns
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === 'cancellations' ? 'active' : ''}`}
              onClick={() => setTab('cancellations')}
            >
              <XCircle size={16} /> My Cancellations
            </button>
          </div>
          <div className="sidebar-section">
            <p className="sidebar-group-title">My WishList</p>
            <button
              className={`sidebar-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setTab('wishlist')}
            >
              <Heart size={16} /> My WishList
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="account-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
