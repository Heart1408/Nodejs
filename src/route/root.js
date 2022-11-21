const express = require('express');
const router = express.Router();
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import categoryController from '../controllers/categoryController';
import adminController from '../controllers/admin/LoginController';

router.post('/api/login', userController.handleLogin);
router.post('/api/register', userController.register);

router.get('/api/product/getListProduct', productController.getListProduct);
router.get('/api/product/getInfoProduct/:id', productController.getInfoProduct);
router.get('/api/product/getRecommendedProduct/:id?', productController.getRecommendedProduct);
router.get('/api/category/getList', categoryController.getList);

router.post('/api/admin/login', adminController.handleLogin);

module.exports = router;
