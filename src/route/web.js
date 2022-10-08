import express from "express";
import homeController from '../controllers/homeController';

let route = express.Router();
const initWebRoute = (app) => {
  route.get('/', homeController.getHomepage);

 return app.use('/', route);
}

export default initWebRoute;
