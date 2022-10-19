import express from "express";
import userController from "../controllers/userController";
import productController from '../controllers/productController';
import verifyToken from '../middleware/auth';

let route = express.Router();
const initAPIRoute = (app) => {
  route.post('/api/login', userController.handleLogin);
  route.post('/api/register', userController.register);

  route.get('/api/getListProduct', productController.getListProduct);
  route.get('/api/getInfoProduct/:id', productController.getInfoProduct);
  route.get('/api/addProductToCart/:id', verifyToken, productController.addProductToCart);
  route.get('/api/getRecommendedProduct/:id?', productController.getRecommendedProduct);
  return app.use('/', route);
}

export default initAPIRoute;
