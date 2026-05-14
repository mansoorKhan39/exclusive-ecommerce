import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
      user.password = newPassword;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/wishlist
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/wishlist/:productId
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const idx = user.wishlist.indexOf(productId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      await user.save();
      return res.json({ message: 'Removed from wishlist', inWishlist: false });
    }

    user.wishlist.push(productId);
    await user.save();
    res.json({ message: 'Added to wishlist', inWishlist: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
