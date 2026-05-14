import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    firstName: { type: String, required: true },
    companyName: { type: String },
    streetAddress: { type: String, required: true },
    apartment: { type: String },
    town: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ['bank', 'cash_on_delivery'], default: 'cash_on_delivery' },
  couponCode: { type: String },
  discount: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
