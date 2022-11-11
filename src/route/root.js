const express = require('express');
const router = express.Router();
import userController from "../controllers/userController";
import productController from '../controllers/productController';

router.post('/api/login', userController.handleLogin);
router.post('/api/register', userController.register);

router.get('/api/product/getListProduct', productController.getListProduct);
router.get('/api/product/getInfoProduct/:id', productController.getInfoProduct);
router.get('/api/product/getRecommendedProduct', productController.getRecommendedProduct);

module.exports = router;
