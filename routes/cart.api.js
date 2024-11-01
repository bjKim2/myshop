const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller');

router.post('/',authController.authenticate,cartController.addItemToCart);
router.get("/",authController.authenticate,cartController.getCartList);
router.get("/qty",authController.authenticate,cartController.getCartQty);
router.put("/",authController.authenticate,cartController.updateCartItem);
router.delete("/",authController.authenticate,cartController.deleteCartItem);

module.exports = router;
 