const Cart = require('./Cart');
const Product = require('./Product');

// @desc    Get cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.product', 'title price images isAvailable stock sellerId');

    if (!cart) {
      cart = { items: [], userId: req.user._id };
    }

    // Filter out unavailable products
    const validItems = cart.items ? cart.items.filter(
      (item) => item.product && item.product.isAvailable
    ) : [];

    const total = validItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );

    res.json({ items: validItems, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      'items.product', 'title price images isAvailable stock'
    );

    const total = populated.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );

    res.json({ message: 'Added to cart', items: populated.items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      'items.product', 'title price images isAvailable stock'
    );

    const total = populated.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );

    res.json({ items: populated.items, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      'items.product', 'title price images isAvailable stock'
    );

    const total = populated.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );

    res.json({ message: 'Removed from cart', items: populated.items, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] },
      { new: true }
    );
    res.json({ message: 'Cart cleared', items: [], total: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
