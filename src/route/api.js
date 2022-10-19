import express from "express";
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import orderController from '../controllers/orderController';
import orderDetailController from '../controllers/orderDetailController';
import verifyToken from '../middleware/auth';

let route = express.Router();
const initAPIRoute = (app) => {
  route.post('/api/login', userController.handleLogin);
  route.post('/api/register', userController.register);

  route.get('/api/getListProduct', productController.getListProduct);
  route.get('/api/getInfoProduct/:id', productController.getInfoProduct);
  route.get('/api/addProductToCart/:id', verifyToken, productController.addProductToCart);
  route.get('/api/getRecommendedProduct/:id?', productController.getRecommendedProduct);

  route.get('/api/getAllOrder', orderController.getAllOrder);
  route.post('/api/changeStatusOrder', orderController.changeStatusOrder);
  route.post('/api/deleteOrder', orderController.deleteOrder);
  route.get('/api/detailOrder/:id', orderDetailController.getDetailOrder);
  route.get('/api/orderHistory', verifyToken, orderController.orderHistory);
  route.post('/api/createOrder', verifyToken, orderDetailController.createOrder); 
  return app.use('/', route);
}

export default initAPIRoute;
