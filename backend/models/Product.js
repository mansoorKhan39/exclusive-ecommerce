import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  category: {
    type: String,
    required: true,
    enum: ['Phones', 'Computers', 'SmartWatch', 'Camera', 'HeadPhones', 'Gaming', "Women's Fashion", "Men's Fashion", 'Electronics', 'Home & Lifestyle', 'Groceries & Pets', 'Medicine', 'Sports & Outdoor', "Baby's & Toys", 'Health & Beauty'],
  },
  images: [{ type: String }],
  colors: [{ type: String }],
  sizes: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isNew: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  flashSale: { type: Boolean, default: false },
  flashSaleEnds: { type: Date },
  tags: [{ type: String }],
}, { timestamps: true });

// Update rating on review
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.numReviews = this.reviews.length;
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
  }
};

productSchema.virtual('discountPercent').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

export default mongoose.model('Product', productSchema);
