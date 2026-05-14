import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, flash, featured, new: isNew } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (flash === 'true') query.flashSale = true;
    if (featured === 'true') query.isFeatured = true;
    if (isNew === 'true') query.isNew = true;

    const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, newest: { createdAt: -1 }, rating: { rating: -1 } };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip((page - 1) * limit).limit(Number(limit));

    res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'firstName lastName avatar');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });

    product.reviews.push({ user: req.user._id, name: req.user.firstName, rating, comment });
    product.updateRating();
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
