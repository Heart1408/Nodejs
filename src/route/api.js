import express from "express";
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import cartController from '../controllers/cartController';
import orderController from '../controllers/orderController';
import orderDetailController from '../controllers/orderDetailController';
import addressController from '../controllers/addressController';
import profileController from '../controllers/profileController';
import adminProductController from '../controllers/admin/ProductController';
import collectionController from '../controllers/admin/collectionController';
import statisticController from '../controllers/admin/statisticController';
import reviewController from '../controllers/reviewController';

import verifyToken from '../middleware/auth';
import verifyRoles from '../middleware/verifyRoles';
const fileUploader = require('../config/cloudinary.config')

let route = express.Router();

const initAPIRoute = (app) => {

  route.post('/token', userController.token);
  route.post('/logout', verifyToken, userController.logout);
  route.post('/changePassword', verifyToken, userController.changePassword);

  route.post('/product/addProductToCart', verifyToken, productController.addProductToCart);
  route.delete('/cart/delete/:productId', verifyToken, cartController.deleteProduct);
  route.put('/cart/changeAmount', verifyToken, cartController.changeAmount);
  route.get('/cart/getListProduct', verifyToken, cartController.getListProduct);

  route.get('/order/all', verifyRoles('admin'), orderController.getAllOrder);
  route.post('/order/changeStatus', verifyRoles('admin', 'user'), orderController.changeStatusOrder);
  route.post('/order/delete', verifyRoles('admin'), orderController.deleteOrder);
  route.get('/order/detail/:id', verifyRoles('admin', 'user'), orderDetailController.getDetailOrder);
  route.get('/order/history/:status', verifyRoles('user'), orderController.orderHistory);
  route.post('/order/create', verifyRoles('user'), orderDetailController.createOrder);
  //route.get('/order/amountSoldProduct', orderDetailController.getAmountSoldProducts);

  route.get('/address', verifyRoles('user'), addressController.getAllAddress);
  route.post('/address/add', verifyRoles('user'), addressController.addAddress);
  route.post('/address/update', verifyRoles('user'), addressController.updateAddress);
  route.post('/address/delete', verifyRoles('user'), addressController.deleteAddress);

  route.get('/profile/:userId', verifyRoles('user', 'admin'), profileController.getProfile);
  route.post('/profile/update', verifyRoles('admin', 'user'), fileUploader.single('file'), profileController.updateProfile);

  route.post('/review/create', verifyRoles('admin', 'user'), reviewController.create);
  route.post('/review/edit', verifyRoles('admin', 'user'), reviewController.edit);
  route.post('/review/delete', verifyRoles('admin', 'user'), reviewController.delete);
  route.post('/review/getStatus', verifyRoles('admin', 'user'), reviewController.getStatus);

  //admin
  route.put('/product/update/:productId', verifyRoles('admin'), adminProductController.update);
  route.delete('/product/delete/:productId', verifyRoles('admin'), adminProductController.deleteProduct);
  route.post('/product/create', verifyRoles('admin'), adminProductController.create);

  route.get('/collection/getList', collectionController.getList);
  route.post('/collection/create', collectionController.create);
  route.delete('/collection/delete/:collectionId', collectionController.deleteCollection);
  route.post('/collection/update/:collectionId', collectionController.update);
  route.get('/collection/getProduct/:collectionId', collectionController.getProduct);
  route.post('/collection/deleteProduct', collectionController.deleteProduct);
  route.post('/collection/addProduct', collectionController.addProduct);

  route.get('/dashboard/sale', statisticController.getSale);

  return app.use('/api', route);
}

export default initAPIRoute;
