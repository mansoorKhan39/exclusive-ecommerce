import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.firstName}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image">
        <div className="auth-image-content">
          <div className="auth-shopping-icon">🛒</div>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrap animate-fade-up">
          <h1 className="auth-title">Log in to Exclusive</h1>
          <p className="auth-subtitle">Enter your details below</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email" name="email" placeholder="Email or Phone Number"
              value={form.email} onChange={handleChange}
              className="input" required
            />
            <input
              type="password" name="password" placeholder="Password"
              value={form.password} onChange={handleChange}
              className="input" required
            />
            <div className="auth-form-actions">
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <Link to="/signup" className="auth-forgot">Forget Password?</Link>
            </div>
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/signup" className="auth-switch-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
