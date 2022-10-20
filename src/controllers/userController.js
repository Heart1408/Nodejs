import userService from '../services/userService';

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      errCode: 1,
      message: 'Missing inputs parameter!'
    })
  }

  let result = await userService.handleLogin(email, password);

  return res.status(200).json(result);
}

let register = async (req, res) => {
  let { username, email, phone, password, confirmPassword } = req.body

  if (!username || !email || !phone || !password || !confirmPassword) {
    return res.status(500).json({
      success: false,
      errCode: 1,
      message: 'Missing inputs parameter!',
    })
  }
  let userData = await userService.register(req.body);

  return res.status(200).json({
    success: userData.success,
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user
  })
}

module.exports = {
  handleLogin: handleLogin,
  register: register,
}
