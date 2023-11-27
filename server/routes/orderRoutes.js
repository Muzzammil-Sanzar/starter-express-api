var express = require('express');
var router = express.Router();
const OrderController = require('../controllers/orderController');

/* CREATE RESTURANT */
router.post('/create', OrderController.createOrder);

/* GET RESTURANT */
router.get('/get', OrderController.getAllOrders);

/* delete RESTURANT */
router.delete('/delete/:id', OrderController.deleteOrder);

module.exports = router;