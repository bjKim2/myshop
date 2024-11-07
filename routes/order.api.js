const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authController = require("../controllers/auth.controller");

router.post("/",authController.authenticate ,orderController.createOrder);
router.get("/",authController.authenticate ,orderController.getOrderList);
router.get("/adminList",authController.authenticate,authController.checkAdminPermission ,orderController.adminGetOrderList);
router.put("/:orderId",authController.authenticate,authController.checkAdminPermission ,orderController.adminUpdateOrder);

module.exports = router;
