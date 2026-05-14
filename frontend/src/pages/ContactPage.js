import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import './ContactPage.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you within 24 hours. 📬');
      setForm({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="breadcrumb">
        <Link to="/">Home</Link><span className="sep">/</span><span className="current">Contact</span>
      </div>

      <div className="contact-layout animate-fade-up">
        {/* Info */}
        <div className="contact-info-card">
          <div className="contact-info-section">
            <div className="contact-icon-wrap">
              <Phone size={22} />
            </div>
            <h3 className="contact-info-title">Call To Us</h3>
            <p className="contact-info-desc">We are available 24/7, 7 days a week.</p>
            <p className="contact-info-detail">Phone: +8801611112222</p>
          </div>

          <div className="contact-divider" />

          <div className="contact-info-section">
            <div className="contact-icon-wrap">
              <Mail size={22} />
            </div>
            <h3 className="contact-info-title">Write To US</h3>
            <p className="contact-info-desc">Fill out our form and we will contact you within 24 hours.</p>
            <p className="contact-info-detail">Emails: customer@exclusive.com</p>
            <p className="contact-info-detail">Emails: support@exclusive.com</p>
          </div>
        </div>

        {/* Form */}
        <form className="contact-form-card" onSubmit={handleSubmit}>
          <div className="contact-form-row">
            <input
              name="name" value={form.name} onChange={handleChange}
              className="input" placeholder="Your Name *" required
            />
            <input
              name="email" value={form.email} onChange={handleChange}
              className="input" type="email" placeholder="Your Email *" required
            />
            <input
              name="phone" value={form.phone} onChange={handleChange}
              className="input" type="tel" placeholder="Your Phone *" required
            />
          </div>
          <textarea
            name="message" value={form.message} onChange={handleChange}
            className="contact-textarea" placeholder="Your Message" rows={8} required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
