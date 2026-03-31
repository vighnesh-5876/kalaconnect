const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// @desc    Create order (checkout)
// @route   POST /api/orders
// @access  Buyer only
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items & calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.product || !item.product.isAvailable) continue;
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.product.title}"`,
        });
      }

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        title: item.product.title,
        image: item.product.images[0] || '',
        sellerId: item.product.sellerId,
      });

      totalAmount += item.product.price * item.quantity;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    // Create order
    const order = await Order.create({
      buyerId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid', // mock payment
      paymentId: `PAY-${Date.now()}`,
      notes: notes || '',
      status: 'processing',
    });

    // Update product stock & sales
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, totalSold: item.quantity },
      });
    }

    // Update seller total sales
    const sellerIds = [...new Set(orderItems.map((i) => i.sellerId?.toString()))];
    for (const sellerId of sellerIds) {
      if (sellerId) {
        const sellerItems = orderItems.filter((i) => i.sellerId?.toString() === sellerId);
        const sellerTotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
        await User.findByIdAndUpdate(sellerId, { $inc: { totalSales: sellerTotal } });
      }
    }

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    const populated = await Order.findById(order._id).populate('buyerId', 'name email');

    res.status(201).json({ order: populated, message: 'Order placed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get buyer's orders
// @route   GET /api/orders
// @access  Private (buyer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title images');

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title images price')
      .populate('buyerId', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check access
    if (order.buyerId._id.toString() !== req.user._id.toString()) {
      // Allow sellers to see orders containing their products
      const isSeller = order.items.some(
        (item) => item.sellerId?.toString() === req.user._id.toString()
      );
      if (!isSeller) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get seller's received orders
// @route   GET /api/orders/seller
// @access  Seller only
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.sellerId': req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate('buyerId', 'name email')
      .populate('items.product', 'title images');

    // Filter items to only show this seller's items
    const filtered = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.filter(
        (item) => item.sellerId?.toString() === req.user._id.toString()
      ),
    }));

    res.json({ orders: filtered });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status (seller)
// @route   PUT /api/orders/:id/status
// @access  Seller only
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create Razorpay order for payment
// @route   POST /api/orders/razorpay/create-order
// @access  Private (buyer)
const createRazorpayOrder = async (req, res) => {
  try {
    const { shippingAddress, notes } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items & calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.product || !item.product.isAvailable) continue;
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${item.product.title}"`,
        });
      }

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        title: item.product.title,
        image: item.product.images[0] || '',
        sellerId: item.product.sellerId,
      });

      totalAmount += item.product.price * item.quantity;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    // Add GST (18%)
    const gst = Math.round(totalAmount * 0.18);
    const grandTotal = totalAmount + gst;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: grandTotal * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        cartItems: orderItems.length,
        userId: req.user._id.toString(),
      },
    });

    // Create order in DB with pending payment status
    const order = await Order.create({
      buyerId: req.user._id,
      items: orderItems,
      totalAmount,
      gst,
      grandTotal,
      shippingAddress,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id,
      notes: notes || '',
      status: 'pending',
    });

    res.status(201).json({
      order: {
        _id: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: grandTotal,
        items: orderItems,
        message: 'Razorpay order created',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay payment and complete order
// @route   POST /api/orders/razorpay/verify-payment
// @access  Private (buyer)
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update order with payment details
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'paid',
        paymentId: razorpayPaymentId,
        status: 'processing',
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update product stock & sales
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, totalSold: item.quantity },
      });
    }

    // Update seller total sales
    const sellerIds = [...new Set(order.items.map((i) => i.sellerId?.toString()))];
    for (const sellerId of sellerIds) {
      if (sellerId) {
        const sellerItems = order.items.filter((i) => i.sellerId?.toString() === sellerId);
        const sellerTotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
        await User.findByIdAndUpdate(sellerId, { $inc: { totalSales: sellerTotal } });
      }
    }

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    res.json({ order, message: 'Payment verified and order confirmed!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification error' });
  }
};

// @desc    Handle payment failure
// @route   POST /api/orders/razorpay/payment-failed
// @access  Private (buyer)
const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'failed', status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order, message: 'Payment failed, order cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error handling payment failure' });
  }
};

module.exports = { 
  createOrder, 
  getMyOrders, 
  getOrder, 
  getSellerOrders, 
  updateOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure
};
