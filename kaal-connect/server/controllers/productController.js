const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12, seller } = req.query;

    const query = { isAvailable: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') query.category = category;
    if (seller) query.sellerId = seller;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      'rating': { averageRating: -1 },
      'popular': { totalSold: -1 },
    };

    const sortBy = sortOptions[sort] || { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('sellerId', 'name avatar bio')
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true, isFeatured: true })
      .populate('sellerId', 'name avatar')
      .limit(8)
      .sort({ createdAt: -1 });

    // fallback if no featured
    if (products.length < 4) {
      const fallback = await Product.find({ isAvailable: true })
        .populate('sellerId', 'name avatar')
        .sort({ averageRating: -1, totalSold: -1 })
        .limit(8);
      return res.json({ products: fallback });
    }

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name avatar bio location website createdAt totalSales');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Seller only
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { title, description, price, category, stock, tags, dimensions, medium } = req.body;

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      images,
      sellerId: req.user._id,
      stock: Number(stock) || 1,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      dimensions: dimensions || '',
      medium: medium || '',
    });

    res.status(201).json({ product, message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Seller only (own product)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const { title, description, price, category, stock, isAvailable, tags, dimensions, medium } = req.body;

    const update = {};
    if (title) update.title = title;
    if (description) update.description = description;
    if (price !== undefined) update.price = Number(price);
    if (category) update.category = category;
    if (stock !== undefined) update.stock = Number(stock);
    if (isAvailable !== undefined) update.isAvailable = isAvailable === 'true' || isAvailable === true;
    if (tags) update.tags = tags.split(',').map((t) => t.trim());
    if (dimensions !== undefined) update.dimensions = dimensions;
    if (medium !== undefined) update.medium = medium;

    if (req.files && req.files.length > 0) {
      update.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('sellerId', 'name avatar');

    res.json({ product: updated, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Seller only (own product)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get seller's own products
// @route   GET /api/products/my-products
// @access  Seller only
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, getFeaturedProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts };
