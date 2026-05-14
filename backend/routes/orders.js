import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items in order' });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      subtotal += product.price * item.quantity;
      orderItems.push({ product: product._id, name: product.name, image: product.images[0], price: product.price, quantity: item.quantity });

      // Update stock
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const shippingCost = subtotal > 140 ? 0 : 10;
    const discount = couponCode === 'EXCLUSIVE10' ? subtotal * 0.1 : 0;
    const total = subtotal + shippingCost - discount;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      discount,
      subtotal,
      shippingCost,
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('items.product', 'name images');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'firstName lastName email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status,
      ...(status === 'delivered' ? { isDelivered: true, deliveredAt: new Date() } : {}),
    }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
