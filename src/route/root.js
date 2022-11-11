const express = require('express');
const router = express.Router();
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import categoryController from '../controllers/categoryController';

router.post('/api/login', userController.handleLogin);
router.post('/api/register', userController.register);

router.get('/api/product/getListProduct', productController.getListProduct);
router.get('/api/product/getInfoProduct/:id', productController.getInfoProduct);

router.get('/api/product/getRecommendedProduct', productController.getRecommendedProduct);
router.get('/api/category/getList', categoryController.getList);

module.exports = router;
