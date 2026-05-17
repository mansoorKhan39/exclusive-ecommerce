import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, TrendingUp,
  Plus, Edit2, Trash2, X, Check, Search, ChevronDown,
  DollarSign, Eye, AlertCircle, ArrowUpRight, ArrowDownRight,
  RefreshCw, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus, getAllUsers
} from '../services/api';
import toast from 'react-hot-toast';
import './AdminPage.css';

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ title, value, icon, color, change, changeType }) => (
  <div className="admin-stat-card" style={{ '--accent': color }}>
    <div className="stat-card-top">
      <div className="stat-card-icon">{icon}</div>
      <span className={`stat-change ${changeType}`}>
        {changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </span>
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-title">{title}</div>
  </div>
);

// ── Product Form Modal ──────────────────────────────────────
const CATEGORIES = [
  'Phones','Computers','SmartWatch','Camera','HeadPhones','Gaming',
  "Women's Fashion","Men's Fashion",'Electronics','Home & Lifestyle',
  'Groceries & Pets','Medicine','Sports & Outdoor',"Baby's & Toys",'Health & Beauty'
];

const emptyProduct = {
  name:'', description:'', price:'', originalPrice:'', category:'Phones',
  images:'', colors:'', sizes:'', stock:'', isNew:false, isFeatured:false, flashSale:false,
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(product ? {
    ...product,
    images: product.images?.join(', ') || '',
    colors: product.colors?.join(', ') || '',
    sizes: product.sizes?.join(', ') || '',
  } : emptyProduct);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || undefined,
        stock: Number(form.stock),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (product?._id) {
        await updateProduct(product._id, data);
        toast.success('Product updated!');
      } else {
        await createProduct(data);
        toast.success('Product created!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box animate-fade-up">
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-grid-2">
            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="input" required placeholder="e.g. iPhone 15 Pro" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="input modal-textarea" required placeholder="Detailed product description..." />
          </div>
          <div className="modal-grid-3">
            <div className="form-group">
              <label>Price ($) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} className="input" required min="0" placeholder="99" />
            </div>
            <div className="form-group">
              <label>Original Price ($)</label>
              <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} className="input" min="0" placeholder="129" />
            </div>
            <div className="form-group">
              <label>Stock *</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} className="input" required min="0" placeholder="50" />
            </div>
          </div>
          <div className="form-group">
            <label>Image URLs (comma separated)</label>
            <input name="images" value={form.images} onChange={handleChange} className="input" placeholder="https://..., https://..." />
          </div>
          <div className="modal-grid-2">
            <div className="form-group">
              <label>Colors (comma separated)</label>
              <input name="colors" value={form.colors} onChange={handleChange} className="input" placeholder="black, white, red" />
            </div>
            <div className="form-group">
              <label>Sizes (comma separated)</label>
              <input name="sizes" value={form.sizes} onChange={handleChange} className="input" placeholder="S, M, L, XL" />
            </div>
          </div>
          <div className="modal-checkboxes">
            {[['isNew','New Arrival'],['isFeatured','Featured'],['flashSale','Flash Sale']].map(([key,label]) => (
              <label key={key} className="modal-checkbox">
                <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Products Tab ────────────────────────────────────────────
const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 100, search });
      setProducts(res.data.products);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const openAdd = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p) => { setEditProduct(p); setModalOpen(true); };

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <h2 className="admin-tab-title">Products <span className="count-badge">{products.length}</span></h2>
        <div className="tab-header-actions">
          <div className="admin-search-wrap">
            <Search size={15} />
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
          </div>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-product-cell">
                      <img
                        src={p.images?.[0] || `https://via.placeholder.com/48?text=${encodeURIComponent(p.name)}`}
                        alt={p.name}
                        className="admin-product-thumb"
                      />
                      <div>
                        <p className="admin-product-name">{p.name}</p>
                        <p className="admin-product-id">#{p._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="category-pill">{p.category}</span></td>
                  <td>
                    <div>
                      <span className="price-main">${p.price}</span>
                      {p.originalPrice > p.price && (
                        <span className="price-original">${p.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`stock-badge ${p.stock === 0 ? 'out' : p.stock < 10 ? 'low' : 'ok'}`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                    </span>
                  </td>
                  <td>
                    <div className="status-pills">
                      {p.isNew && <span className="status-pill new">New</span>}
                      {p.isFeatured && <span className="status-pill featured">Featured</span>}
                      {p.flashSale && <span className="status-pill flash">Flash</span>}
                      {!p.isNew && !p.isFeatured && !p.flashSale && <span className="status-pill normal">Normal</span>}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/product/${p._id}`} target="_blank" className="table-action-btn view">
                        <Eye size={15} />
                      </Link>
                      <button className="table-action-btn edit" onClick={() => openEdit(p)}>
                        <Edit2 size={15} />
                      </button>
                      <button className="table-action-btn delete" onClick={() => handleDelete(p._id, p.name)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProductModal
          product={editProduct}
          onClose={() => setModalOpen(false)}
          onSave={fetchProducts}
        />
      )}
    </div>
  );
};

// ── Orders Tab ──────────────────────────────────────────────
const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled'];
const STATUS_COLORS = {
  pending: '#f5a623', processing: '#2196F3', shipped: '#9C27B0',
  delivered: '#00b517', cancelled: '#DB4444',
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <h2 className="admin-tab-title">Orders <span className="count-badge">{orders.length}</span></h2>
        <div className="tab-header-actions">
          <select className="admin-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" onClick={fetchOrders}><RefreshCw size={14} /></button>
        </div>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order._id}>
                  <td className="order-id-cell">#{order._id.slice(-8).toUpperCase()}</td>
                  <td>
                    <div>
                      <p className="admin-product-name">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="admin-product-id">{order.user?.email}</p>
                    </div>
                  </td>
                  <td><span className="items-count">{order.items?.length} item(s)</span></td>
                  <td><strong>${order.total?.toLocaleString()}</strong></td>
                  <td>
                    <span className="payment-pill">
                      {order.paymentMethod === 'cash_on_delivery' ? '💵 COD' : '🏦 Bank'}
                    </span>
                  </td>
                  <td className="date-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      style={{ borderColor: STATUS_COLORS[order.status] }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <ShoppingBag size={48} />
              <p>No {filter !== 'all' ? filter : ''} orders found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Users Tab ───────────────────────────────────────────────
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <h2 className="admin-tab-title">Users <span className="count-badge">{users.length}</span></h2>
        <div className="admin-search-wrap">
          <Search size={15} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
        </div>
      </div>
      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Wishlist</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-product-cell">
                      <div className="user-avatar-sm">{u.firstName?.[0]?.toUpperCase()}</div>
                      <span className="admin-product-name">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="admin-product-id">{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td className="date-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>{u.wishlist?.length || 0} items</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Dashboard Overview ──────────────────────────────────────
const OverviewTab = ({ products, orders, users }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStock = products.filter(p => p.stock < 10).length;

  const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);

  return (
    <div className="admin-tab">
      <h2 className="admin-tab-title" style={{ marginBottom: 24 }}>Dashboard Overview</h2>

      <div className="stats-grid">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign size={22}/>} color="#00b517" change="12.5%" changeType="up" />
        <StatCard title="Total Orders" value={orders.length} icon={<ShoppingBag size={22}/>} color="#2196F3" change="8.2%" changeType="up" />
        <StatCard title="Total Products" value={products.length} icon={<Package size={22}/>} color="#9C27B0" change="3 new" changeType="up" />
        <StatCard title="Total Users" value={users.length} icon={<Users size={22}/>} color="#f5a623" change="5.1%" changeType="up" />
      </div>

      <div className="overview-grid">
        {/* Recent Orders */}
        <div className="overview-card">
          <div className="overview-card-header">
            <h3>Recent Orders</h3>
            <span className="count-badge">{pendingOrders} pending</span>
          </div>
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id}>
                  <td className="order-id-cell">#{o._id.slice(-6).toUpperCase()}</td>
                  <td>{o.user?.firstName} {o.user?.lastName}</td>
                  <td><strong>${o.total?.toLocaleString()}</strong></td>
                  <td>
                    <span className="mini-status" style={{ background: STATUS_COLORS[o.status] }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        <div className="overview-card">
          <div className="overview-card-header"><h3>Alerts</h3></div>
          <div className="alerts-list">
            {pendingOrders > 0 && (
              <div className="alert-item warning">
                <AlertCircle size={16} />
                <span>{pendingOrders} orders waiting to be processed</span>
              </div>
            )}
            {lowStock > 0 && (
              <div className="alert-item danger">
                <AlertCircle size={16} />
                <span>{lowStock} products with low stock (&lt;10)</span>
              </div>
            )}
            {products.filter(p => p.stock === 0).length > 0 && (
              <div className="alert-item danger">
                <AlertCircle size={16} />
                <span>{products.filter(p=>p.stock===0).length} products out of stock</span>
              </div>
            )}
            {pendingOrders === 0 && lowStock === 0 && (
              <div className="alert-item success">
                <Check size={16} />
                <span>Everything looks great! No issues found.</span>
              </div>
            )}
          </div>

          {/* Category breakdown */}
          <div style={{ marginTop: 24 }}>
            <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>Products by Category</h4>
            {Object.entries(
              products.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category]||0)+1 }), {})
            ).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([cat, count]) => (
              <div key={cat} className="category-bar-row">
                <span className="category-bar-label">{cat}</span>
                <div className="category-bar-track">
                  <div className="category-bar-fill" style={{ width: `${(count/products.length)*100}%` }} />
                </div>
                <span className="category-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Admin Page ─────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18}/> },
  { id: 'products', label: 'Products', icon: <Package size={18}/> },
  { id: 'orders',   label: 'Orders',   icon: <ShoppingBag size={18}/> },
  { id: 'users',    label: 'Users',    icon: <Users size={18}/> },
];

const AdminPage = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    Promise.all([
      getProducts({ limit: 100 }),
      getAllOrders(),
      getAllUsers(),
    ]).then(([p, o, u]) => {
      setProducts(p.data.products);
      setOrders(o.data);
      setUsers(u.data);
    }).catch(() => toast.error('Failed to load admin data'));
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Link to="/" className="admin-brand-link">Exclusive</Link>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'orders' && orders.filter(o=>o.status==='pending').length > 0 && (
                <span className="nav-dot">{orders.filter(o=>o.status==='pending').length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{user.firstName?.[0]}</div>
            <div>
              <p className="admin-user-name">{user.firstName}</p>
              <p className="admin-user-role">Administrator</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={() => { logoutUser(); navigate('/'); }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">
            {TABS.find(t => t.id === activeTab)?.label}
          </h1>
          <div className="admin-topbar-right">
            <Link to="/" className="btn btn-outline btn-sm" target="_blank">
              <Eye size={14} /> View Store
            </Link>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && <OverviewTab products={products} orders={orders} users={users} />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders'   && <OrdersTab />}
          {activeTab === 'users'    && <UsersTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
