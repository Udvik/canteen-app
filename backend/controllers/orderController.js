const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid'); // For generating unique bill numbers

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentStatus } = req.body;

    // Generate unique bill number (you can customize format)
    const billNumber = Math.floor(1000 + Math.random() * 9000).toString(); 

    const newOrder = new Order({
      billNumber,
      items,
      paymentStatus,
      orderStatus: 'pending',
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      billNumber: savedOrder.billNumber,
      paymentStatus: savedOrder.paymentStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by bill number
exports.getOrderByBillNumber = async (req, res) => {
  try {
    const { billNumber } = req.params;
    const order = await Order.findOne({ billNumber }).populate('items.itemId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      billNumber: order.billNumber,
      items: order.items,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark order as preparing
exports.markPreparing = async (req, res) => {
  try {
    const { billNumber } = req.params;

    const order = await Order.findOneAndUpdate(
      { billNumber, orderStatus: 'pending' },         
      { orderStatus: 'preparing' , updatedAt: Date.now() + (5.5 * 60 * 60 * 1000)},                   
      { new: true }  
    );

    if (!order) {
      return res.status(400).json({ message: 'order not found or already getting prepared' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Mark order as served
exports.markServed = async (req, res) => {
  try {
    const { billNumber } = req.params;
    const order = await Order.findOneAndUpdate(
      { billNumber , orderStatus: 'preparing' },
      { orderStatus: 'served' , updatedAt: Date.now() + (5.5 * 60 * 60 * 1000) },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'didnt start preparing or already served' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markPending = async (req, res) => {
  try {
    const { billNumber } = req.params;

    const order = await Order.findOneAndUpdate(
      { billNumber}, // Only update if status is preparing or served
      { orderStatus: 'pending', updatedAt: Date.now() + (5.5 * 60 * 60 * 1000) }, // Set status to pending
      { new: true } // Return the updated document
    );

    res.json(order);
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
};
