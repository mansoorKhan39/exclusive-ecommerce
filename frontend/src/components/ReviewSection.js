import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ReviewSection.css';

const StarPicker = ({ value, onChange }) => (
  <div className="star-picker">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" className="star-pick-btn" onClick={() => onChange(s)}>
        <Star size={24} fill={s <= value ? '#f5a623' : 'none'} color={s <= value ? '#f5a623' : '#ddd'} />
      </button>
    ))}
  </div>
);

const ReviewSection = ({ productId, reviews = [], onReviewAdded }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) { toast.error('Please log in to write a review'); return; }
    if (!comment.trim()) { toast.error('Please write a comment'); return; }
    setLoading(true);
    try {
      await addReview(productId, { rating, comment });
      toast.success('Review submitted! ⭐');
      setComment('');
      setRating(5);
      setShowForm(false);
      onReviewAdded?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="review-section">
      <div className="review-header">
        <div>
          <h2 className="review-title">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="review-summary">
              <span className="review-avg">{avgRating}</span>
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(avgRating) ? '#f5a623' : 'none'} color={s <= Math.round(avgRating) ? '#f5a623' : '#ddd'} />
                ))}
              </div>
              <span className="review-count-text">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>
        {user && !showForm && (
          <button className="btn btn-outline btn-sm" onClick={() => setShowForm(true)}>
            Write a Review
          </button>
        )}
      </div>

      {/* Write Review Form */}
      {showForm && (
        <form className="review-form animate-fade-up" onSubmit={handleSubmit}>
          <h3>Your Review</h3>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div className="form-group">
            <label className="form-label">Comment</label>
            <textarea
              className="input review-textarea"
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="review-form-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <Star size={40} color="#ddd" />
          <p>No reviews yet. Be the first to review this product!</p>
          {user && !showForm && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Write a Review</button>
          )}
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-card-header">
                <div className="reviewer-avatar">{r.name?.[0]?.toUpperCase()}</div>
                <div>
                  <p className="reviewer-name">{r.name}</p>
                  <p className="review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="review-stars">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} fill={s <= r.rating ? '#f5a623' : 'none'} color={s <= r.rating ? '#f5a623' : '#ddd'} />
                  ))}
                </div>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
