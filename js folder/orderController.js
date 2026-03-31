const Order = require('./Order');
const Cart = require('./Cart');
const Product = require('./Product');
const User = require('./User');

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

module.exports = { createOrder, getMyOrders, getOrder, getSellerOrders, updateOrderStatus };
