const User = require('./User');
const Product = require('./Product');

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'title price images averageRating numReviews isAvailable');
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/wishlist/toggle/:productId
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const idx = user.wishlist.indexOf(productId);
    let action;
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      action = 'removed';
    } else {
      user.wishlist.push(productId);
      action = 'added';
    }

    await user.save();
    res.json({ message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`, wishlist: user.wishlist, action });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWishlist, toggleWishlist };
