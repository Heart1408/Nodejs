import express from "express";
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import orderController from '../controllers/orderController';
import orderDetailController from '../controllers/orderDetailController';
import verifyToken from '../middleware/auth';
const expressListRoutes = require('express-list-routes');

let route = express.Router();

const initAPIRoute = (app) => {
  route.post('/login', userController.handleLogin);
  route.post('/register', userController.register);
  route.post('/token', userController.token);
  route.post('/logout', userController.logout);

  route.get('/product/getListProduct', productController.getListProduct);
  route.get('/product/getInfoProduct/:id', productController.getInfoProduct);
  route.get('/product/addProductToCart/:id', verifyToken, productController.addProductToCart);
  route.get('/product/getRecommendedProduct/:id?', productController.getRecommendedProduct);

  route.get('/order/getAllOrder', orderController.getAllOrder);
  route.post('/order/changeStatusOrder', orderController.changeStatusOrder);
  route.post('/order/deleteOrder', orderController.deleteOrder);
  route.get('/order/detailOrder/:id', orderDetailController.getDetailOrder);
  route.get('/order/orderHistory', verifyToken, orderController.orderHistory);
  route.post('/order/createOrder', verifyToken, orderDetailController.createOrder);

  return app.use('/api', route);
}

export default initAPIRoute;
