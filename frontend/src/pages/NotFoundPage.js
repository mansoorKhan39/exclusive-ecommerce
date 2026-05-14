import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => (
  <div className="container" style={{ padding: '40px 24px' }}>
    <div className="breadcrumb">
      <Link to="/">Home</Link><span className="sep">/</span><span className="current">404 Error</span>
    </div>
    <div className="notfound-content animate-fade-up">
      <h1 className="notfound-title">404 Not Found</h1>
      <p className="notfound-desc">Your visited page not found. You may go home page.</p>
      <Link to="/" className="btn btn-primary btn-lg">Back to home page</Link>
    </div>
  </div>
);

export default NotFoundPage;
