import express from "express";
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import orderController from '../controllers/orderController';
import orderDetailController from '../controllers/orderDetailController';
import adminProductController from '../controllers/admin/ProductController';
import verifyToken from '../middleware/auth';
import verifyRoles from '../middleware/verifyRoles';

let route = express.Router();

const initAPIRoute = (app) => {

  route.post('/token', userController.token);
  route.post('/logout', verifyToken, userController.logout);
  route.post('/changePassword', verifyToken, userController.changePassword);

  route.get('/product/addProductToCart', verifyToken, productController.addProductToCart);

  route.get('/order/all', verifyRoles('admin'), orderController.getAllOrder);
  route.post('/order/changeStatus', verifyRoles('admin', 'user'), orderController.changeStatusOrder);
  route.post('/order/delete', verifyRoles('admin'), orderController.deleteOrder);
  route.get('/order/detail/:id', verifyRoles('admin', 'user'), orderDetailController.getDetailOrder);
  route.get('/order/history/:status', verifyRoles('user'), orderController.orderHistory);
  route.post('/order/create', verifyRoles('user'), orderDetailController.createOrder);
  //route.get('/order/amountSoldProduct', orderDetailController.getAmountSoldProducts);


  //admin
  route.put('/product/update/:productId', adminProductController.update);
  route.delete('/product/delete/:productId', adminProductController.deleteProduct);
  route.post('/product/create', adminProductController.create);
  return app.use('/api', route);
}

export default initAPIRoute;
