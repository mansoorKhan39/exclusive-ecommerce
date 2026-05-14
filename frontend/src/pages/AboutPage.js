import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Headphones, ShieldCheck } from 'lucide-react';
import './AboutPage.css';

const stats = [
  { value: '10.5k', label: 'Sellers active our site', icon: '🏪' },
  { value: '33k', label: 'Monthly Product Sale', icon: '💰', highlight: true },
  { value: '45.5k', label: 'Customer active in our site', icon: '🛍️' },
  { value: '25k', label: 'Annual gross sale in our site', icon: '💎' },
];

const team = [
  { name: 'Tom Cruise', role: 'Founder & Chairman', emoji: '👨‍💼' },
  { name: 'Emma Watson', role: 'Managing Director', emoji: '👩‍💼' },
  { name: 'Will Smith', role: 'Product Designer', emoji: '👨‍🎨' },
];

const AboutPage = () => (
  <div className="about-page">
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <div className="breadcrumb">
        <Link to="/">Home</Link><span className="sep">/</span><span className="current">About</span>
      </div>

      {/* Story */}
      <div className="about-story animate-fade-up">
        <div className="about-story-text">
          <h1 className="about-heading">Our Story</h1>
          <p>Launched in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 million customers across the region.</p>
          <p>Exclusive has more than 1 Million products to offer, growing at a very fast rate. Exclusive offers a diverse assortment in categories ranging from consumer.</p>
        </div>
        <div className="about-story-image">
          <div className="about-image-placeholder">
            <span style={{ fontSize: 80 }}>🛍️</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats">
        {stats.map((s, i) => (
          <div key={s.value} className={`stat-card ${s.highlight ? 'highlight' : ''}`}>
            <div className="stat-icon">{s.icon}</div>
            <h3 className="stat-value">{s.value}</h3>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="about-team">
        {team.map(member => (
          <div key={member.name} className="team-card animate-fade-up">
            <div className="team-avatar">{member.emoji}</div>
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role">{member.role}</p>
            <div className="team-social">
              <a href="#" className="team-social-icon">𝕏</a>
              <a href="#" className="team-social-icon">📸</a>
              <a href="#" className="team-social-icon">💼</a>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="about-features">
        {[
          { icon: <Truck size={40} />, title: 'Free And Fast Delivery', desc: 'Free delivery for all orders over $140' },
          { icon: <Headphones size={40} />, title: '24/7 Customer Service', desc: 'Friendly 24/7 customer support' },
          { icon: <ShieldCheck size={40} />, title: 'Money Back Guarantee', desc: 'We return money within 30 days' },
        ].map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon-wrap">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AboutPage;
