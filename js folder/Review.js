const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: 100,
  },
  body: {
    type: String,
    required: [true, 'Review body is required'],
    minlength: 10,
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

// One review per buyer per product
reviewSchema.index({ product: 1, buyer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
