import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { getOrder } from '../services/api';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder(id).then(res => setOrder(res.data)).catch(() => {});
  }, [id]);

  return (
    <div className="container" style={{ padding: '60px 24px 80px' }}>
      <div className="success-content animate-fade-up">
        <div className="success-icon">
          <CheckCircle size={80} color="var(--secondary)" />
        </div>
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-desc">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>

        {order && (
          <div className="success-order-card">
            <div className="success-order-header">
              <Package size={20} />
              <span>Order #{order._id.slice(-8).toUpperCase()}</span>
              <span className="success-order-status">Pending</span>
            </div>
            <div className="success-order-items">
              {order.items?.map(item => (
                <div key={item._id} className="success-order-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="success-order-total">
              <span>Total Paid</span>
              <strong>${order.total?.toLocaleString()}</strong>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to="/account?tab=orders" className="btn btn-outline">Track Order</Link>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
