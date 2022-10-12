import express from "express";
import userController from "../controllers/userController";

let route = express.Router();
const initWebRoute = (app) => {
  route.post('/api/login', userController.handleLogin);
  route.post('/api/register', userController.register);

  return app.use('/', route);
}

export default initWebRoute;
