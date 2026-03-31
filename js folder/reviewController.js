const Review = require('./Review');
const Product = require('./Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('buyer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a review
// @route   POST /api/reviews/:productId
// @access  Buyer only
const createReview = async (req, res) => {
  try {
    const { rating, title, body } = req.body;

    const existing = await Review.findOne({
      product: req.params.productId,
      buyer: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: req.params.productId,
      buyer: req.user._id,
      rating: Number(rating),
      title,
      body,
    });

    // Recalculate product average rating
    const allReviews = await Review.find({ product: req.params.productId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(req.params.productId, {
      averageRating: Math.round(avg * 10) / 10,
      numReviews: allReviews.length,
    });

    const populated = await review.populate('buyer', 'name avatar');
    res.status(201).json({ review: populated, message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Buyer (own review)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate
    const allReviews = await Review.find({ product: productId });
    const avg = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(avg * 10) / 10,
      numReviews: allReviews.length,
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProductReviews, createReview, deleteReview };
