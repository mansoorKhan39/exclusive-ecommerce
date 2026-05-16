import React, { useState, useEffect } from 'react';
import Iphone14 from "../assets/iphone14.jpg";
import { Link } from 'react-router-dom';
import { FaApple } from "react-icons/fa";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, Headphones, ShieldCheck } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Phones', icon: '📱' },
  { name: 'Computers', icon: '💻' },
  { name: 'SmartWatch', icon: '⌚' },
  { name: 'Camera', icon: '📷' },
  { name: 'HeadPhones', icon: '🎧' },
  { name: 'Gaming', icon: '🎮' },
];

const CountdownTimer = ({ endDate }) => {
  const [time, setTime] = useState({ days: 3, hours: 23, minutes: 19, seconds: 56 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  return (
    <div className="countdown">
      {[['Days', time.days], ['Hours', time.hours], ['Minutes', time.minutes], ['Seconds', time.seconds]].map(([label, val]) => (
        <div key={label} className="countdown-unit">
          <span className="countdown-label">{label}</span>
          <span className="countdown-value">{pad(val)}</span>
        </div>
      ))}
    </div>
  );
};

const HeroBanner = () => {
  const [slide, setSlide] = useState(0);
  const slides = [
    { bg: '#1a1a1a', label: 'iPhone 14 Series', title: 'Up to 10% off Voucher', subtitle: 'Shop the latest iPhone 14 Series', img: Iphone14 },
    { bg: '#0d47a1', label: 'Best Speakers', title: 'Enhance Your Music Experience', subtitle: 'Crystal clear sound, everywhere you go', img: '🔊' },
    { bg: '#1b5e20', label: 'New Arrival', title: 'Shop Our Latest Collection', subtitle: 'Discover trending products at great prices', img: '🛍️' },
  ];
  const next = () => setSlide(s => (s + 1) % slides.length);
  const prev = () => setSlide(s => (s - 1 + slides.length) % slides.length);

  return (
    <div className="hero-banner" style={{ background: slides[slide].bg }}>
      <button className="hero-nav prev" onClick={prev}><ChevronLeft size={24} /></button>
      <div className="hero-content animate-fade-in" key={slide}>
        <div className="hero-text">
          <p className="hero-label">
            <FaApple size={32} />
            {slides[slide].label}
          </p>
          <h1 className="hero-title">{slides[slide].title}</h1>
          <p className="hero-subtitle">{slides[slide].subtitle}</p>
          <Link to="/shop" className="hero-cta">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero-image">
          <img src={slides[slide].img} alt="iPhone 14" />
        </div>
      </div>
      <button className="hero-nav next" onClick={next}><ChevronRight size={24} /></button>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ tag, title, withNav = false, onPrev, onNext, children }) => (
  <div className="section-header-row">
    <div>
      <div className="section-tag">
        <div className="section-tag-bar" />
        <span className="section-tag-text">{tag}</span>
      </div>
      <div className="section-title-row">
        <h2 className="section-title">{title}</h2>
        {children}
      </div>
    </div>
    {withNav && (
      <div className="section-nav">
        <button className="section-nav-btn" onClick={onPrev}><ChevronLeft size={20} /></button>
        <button className="section-nav-btn" onClick={onNext}><ChevronRight size={20} /></button>
      </div>
    )}
  </div>
);

const HomePage = () => {
  const [flashProducts, setFlashProducts] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ limit: 8, sort: 'newest' }),
      getProducts({ limit: 4, sort: 'rating' }),
      getProducts({ limit: 8 }),
    ]).then(([flash, best, all]) => {
      setFlashProducts(flash.data.products);
      setBestSelling(best.data.products);
      setAllProducts(all.data.products);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="homepage">
      {/* Hero */}
      <div className="container">
        <div className="homepage-hero">
          {/* Category Sidebar */}
          <aside className="category-sidebar">
            {['Women\'s Fashion','Men\'s Fashion','Electronics','Home & Lifestyle',
              'Groceries & Pets','Medicine','Sports & Outdoor','Baby\'s & Toys','Health & Beauty'
            ].map(cat => (
              <Link to={`/shop?category=${encodeURIComponent(cat)}`} key={cat} className="sidebar-cat-link">
                <span>{cat}</span>
                <ChevronRight size={14} />
              </Link>
            ))}
          </aside>
          <HeroBanner />
        </div>
      </div>

      {/* Flash Sales */}
      <section className="section container">
        <SectionHeader tag="Today's" title="Flash Sales" withNav>
          <CountdownTimer />
        </SectionHeader>
        {loading ? (
          <div className="grid-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 280, borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <div className="grid-4">
            {flashProducts.map((p, i) => <ProductCard key={p._id} product={p} style={{ animationDelay: `${i * 0.1}s` }} />)}
          </div>
        )}
        <div className="section-cta">
          <Link to="/shop" className="btn btn-primary">View All Products</Link>
        </div>
        <div className="divider" />
      </section>

      {/* Browse By Category */}
      <section className="section container">
        <SectionHeader tag="Categories" title="Browse By Category" withNav />
        <div className="category-grid">
          {CATEGORIES.map(cat => (
            <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
        <div className="divider" />
      </section>

      {/* Best Selling */}
      <section className="section container">
        <div className="section-header-row">
          <div>
            <div className="section-tag"><div className="section-tag-bar" /><span className="section-tag-text">This Month</span></div>
            <h2 className="section-title">Best Selling Products</h2>
          </div>
          <Link to="/shop?sort=rating" className="btn btn-primary btn-sm">View All</Link>
        </div>
        <div className="grid-4">
          {bestSelling.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Music Banner */}
      <section className="music-banner">
        <div className="container">
          <div className="music-banner-inner">
            <div className="music-banner-text">
              <span className="music-tag">Categories</span>
              <h2>Enhance Your<br />Music Experience</h2>
              <div className="music-countdown">
                {[['22', 'Hours'], ['55', 'Days'], ['59', 'Minutes']].map(([v, l]) => (
                  <div key={l} className="music-time">
                    <span className="music-time-val">{v}</span>
                    <span className="music-time-label">{l}</span>
                  </div>
                ))}
              </div>
              <Link to="/shop?category=HeadPhones" className="btn btn-primary">Buy Now!</Link>
            </div>
            <div className="music-banner-image">🎵🔊</div>
          </div>
        </div>
      </section>

      {/* Explore Products */}
      <section className="section container">
        <SectionHeader tag="Our Products" title="Explore Our Products" withNav />
        <div className="grid-4">
          {allProducts.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
        <div className="section-cta">
          <Link to="/shop" className="btn btn-primary">View All Products</Link>
        </div>
      </section>

      {/* New Arrival */}
      <section className="section container">
        <SectionHeader tag="Featured" title="New Arrival" />
        <div className="new-arrival-grid">
          <Link to="/shop" className="arrival-main arrival-card">
            <div className="arrival-content">
              <h3>PlayStation 5</h3>
              <p>Black and White version of the PS5 coming out on sale.</p>
              <span className="arrival-link">Shop Now →</span>
            </div>
            <div className="arrival-icon">🎮</div>
          </Link>
          <div className="arrival-right">
            <Link to="/shop?category=Women's Fashion" className="arrival-card arrival-half">
              <div className="arrival-content">
                <h3>Women's Collections</h3>
                <p>Featured woman collections that give you another vibe.</p>
                <span className="arrival-link">Shop Now →</span>
              </div>
              <div className="arrival-icon">👗</div>
            </Link>
            <div className="arrival-bottom">
              <Link to="/shop?category=HeadPhones" className="arrival-card arrival-small">
                <div className="arrival-content">
                  <h3>Speakers</h3>
                  <p>Amazon wireless speakers</p>
                  <span className="arrival-link">Shop Now →</span>
                </div>
                <div className="arrival-icon" style={{ fontSize: '48px' }}>🔊</div>
              </Link>
              <Link to="/shop" className="arrival-card arrival-small">
                <div className="arrival-content">
                  <h3>Perfume</h3>
                  <p>GUCCI INTENSE OUD EDP</p>
                  <span className="arrival-link">Shop Now →</span>
                </div>
                <div className="arrival-icon" style={{ fontSize: '48px' }}>🌸</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section container">
        <div className="features-grid">
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
      </section>
    </div>
  );
};

export default HomePage;
