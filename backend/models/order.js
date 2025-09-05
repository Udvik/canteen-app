const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      quantity: { type: Number, default: 1, min: 1 },
    }
  ],
  paymentStatus: { type: Boolean, default: false },
  orderStatus: { type: String, enum: ['pending', 'preparing', 'served'], default: 'pending' },
  createdAt: { type: Date, default: Date.now + (5.5 * 60 * 60 * 1000) },
  updatedAt: { type: Date, default: Date.now + (5.5 * 60 * 60 * 1000) },
});

// Middleware to update updatedAt on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
