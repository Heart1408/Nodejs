const express = require('express');
const router = express.Router();
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import categoryController from '../controllers/categoryController';
import adminController from '../controllers/admin/LoginController';
import reviewController from '../controllers/reviewController';

router.post('/api/login', userController.handleLogin);
router.post('/api/register', userController.register);

router.get('/api/product/getListProduct', productController.getListProduct);
router.get('/api/product/getInfoProduct/:id', productController.getInfoProduct);
router.get('/api/getListSize', productController.getListSize);
router.get('/api/product/getRecommendedProduct', productController.getRecommendedProduct);

router.get('/api/category/getList', categoryController.getList);
router.get('/api/category/getListBrand', categoryController.getListBrand);

router.get('/api/review/getList/:productId', reviewController.getList);

router.post('/api/admin/login', adminController.handleLogin);

module.exports = router;
