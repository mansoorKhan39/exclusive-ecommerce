import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const [lang, setLang] = useState('English');
  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{' '}
          <Link to="/shop" className="announcement-link">ShopNow</Link>
        </span>
        <div className="announcement-lang">
          <select value={lang} onChange={e => setLang(e.target.value)}>
            <option>English</option>
            <option>Français</option>
            <option>Español</option>
            <option>Deutsch</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
