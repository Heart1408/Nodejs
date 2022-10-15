import db from '../models';
import userService from '../services/userService';

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: 'Missing inputs parameter!',
    })
  }

  let userData = await userService.handleLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user,
  })
}

let register = async (req, res) => {
  let { username, email, phone, password, confirmPassword } = req.body
  
  if (!username || !email || !phone || !password || !confirmPassword) {
    return res.status(500).json({
      errCode: 1,
      message: 'Missing inputs parameter!',
    })
  }
  let userData = await userService.register(req.body);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user
  })
}

module.exports = {
  handleLogin: handleLogin,
  register: register,
}
