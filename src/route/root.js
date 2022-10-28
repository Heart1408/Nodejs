const express = require('express');
const router = express.Router();
import userController from "../controllers/userController";

router.post('/login', userController.handleLogin);
router.post('/register', userController.register);

module.exports = router;