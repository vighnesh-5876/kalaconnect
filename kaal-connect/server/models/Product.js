const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
  description: { type: String, required: true, minlength: 10, maxlength: 2000 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ['Paintings','Sculptures','Handmade Crafts','Photography','Digital Art','Jewelry','Textiles','Ceramics','Other'] },
  images: [{ type: String }],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: Number, default: 1, min: 0 },
  isAvailable: { type: Boolean, default: true },
  tags: [{ type: String, trim: true }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  dimensions: { type: String, default: '' },
  medium: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);