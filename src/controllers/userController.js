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
  res.cookie('refreshToken', result.token.refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 100
  });

  return res.status(200).json({
    success: result.success,
    token: result.token.accessToken,
    user_info: result.user_info,
  });
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

let token = async (req, res) => {
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  let data = await userService.token(refreshToken);

  return res.status(200).json(data)
}

let logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(204);

  let result = await userService.logout(refreshToken);
  res.clearCookie('refreshToken');

  return res.status(200).json(result)
}

module.exports = {
  handleLogin: handleLogin,
  register: register,
  token: token,
  logout: logout,
}
