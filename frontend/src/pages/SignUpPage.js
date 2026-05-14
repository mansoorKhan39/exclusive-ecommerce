import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const [form, setForm] = useState({ firstName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data.user, res.data.token);
      toast.success('Account created! Welcome to Exclusive 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Enter your details below</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text" name="firstName" placeholder="Name"
              value={form.firstName} onChange={handleChange}
              className="input" required
            />
            <input
              type="email" name="email" placeholder="Email or Phone Number"
              value={form.email} onChange={handleChange}
              className="input" required
            />
            <input
              type="password" name="password" placeholder="Password"
              value={form.password} onChange={handleChange}
              className="input" required minLength={6}
            />
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <button type="button" className="btn btn-outline btn-full">
              <span style={{ fontSize: 18 }}>G</span> Sign up with Google
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login" className="auth-switch-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
