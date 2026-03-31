const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { protect, sellerOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/my-products', protect, sellerOnly, getMyProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  protect,
  sellerOnly,
  upload.array('images', 5),
  [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  createProduct
);

router.put('/:id', protect, sellerOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);

module.exports = router;