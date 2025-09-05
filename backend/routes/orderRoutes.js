const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:billNumber', orderController.getOrderByBillNumber);
router.put('/:billNumber/prepare', orderController.markPreparing);
router.put('/:billNumber/serve', orderController.markServed);
router.put('/:billNumber/pending', orderController.markPending);

module.exports = router;
