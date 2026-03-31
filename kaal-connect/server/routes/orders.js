const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getOrder, 
  getSellerOrders, 
  updateOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure
} = require('../controllers/orderController');
const { protect, sellerOnly } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/seller', protect, sellerOnly, getSellerOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, sellerOnly, updateOrderStatus);

// Razorpay routes
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify-payment', protect, verifyRazorpayPayment);
router.post('/razorpay/payment-failed', protect, handlePaymentFailure);

module.exports = router;