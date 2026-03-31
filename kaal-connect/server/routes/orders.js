const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, getSellerOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, sellerOnly } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/seller', protect, sellerOnly, getSellerOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, sellerOnly, updateOrderStatus);

module.exports = router;