const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authController = require("../controllers/auth.controller");

router.post("/",authController.authenticate ,orderController.createOrder);
// router.get("/",orderController.getOrders);

module.exports = router;