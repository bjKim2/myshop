const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
router.post('/',userController.createUser);

// router.post('/login',userController.loginWithEmail);
router.get("/me",authController.authenticate,userController.getUser); //  토큰이 valid한 토큰인지 확인

module.exports = router;
