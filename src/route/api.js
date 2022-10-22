import express from "express";
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import orderController from '../controllers/orderController';
import orderDetailController from '../controllers/orderDetailController';
import verifyToken from '../middleware/auth';
import verifyRoles from '../middleware/verifyRoles';
const expressListRoutes = require('express-list-routes');

let route = express.Router();

const initAPIRoute = (app) => {
  route.get('/product/getListProduct', productController.getListProduct);
  route.get('/product/getInfoProduct/:id', productController.getInfoProduct);
  route.get('/product/addProductToCart/:id', productController.addProductToCart);
  route.get('/product/getRecommendedProduct/:id?', productController.getRecommendedProduct);

  route.get('/order/getAllOrder',verifyRoles('admin'), orderController.getAllOrder);
  route.post('/order/changeStatusOrder',verifyRoles('admin', 'user'), orderController.changeStatusOrder);
  route.post('/order/deleteOrder',verifyRoles('admin'), orderController.deleteOrder);
  route.get('/order/detailOrder/:id',verifyRoles('admin', 'user'), orderDetailController.getDetailOrder);
  route.get('/order/orderHistory',verifyRoles('user'), orderController.orderHistory);
  route.post('/order/createOrder',verifyRoles('user'), orderDetailController.createOrder);
  route.get('/order/amountSoldProduct', orderDetailController.getAmountSoldProducts);

  return app.use('/api', route);
}

export default initAPIRoute;

//Cái nào cần token thì viết vào đây
