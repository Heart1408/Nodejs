import adminService from '../../services/admin/adminLoginService';

let handleLogin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      errCode: 1,
      message: 'Missing inputs parameter!'
    })
  }
  let result = await adminService.handleLogin(username, password);

  if (!result.success) {
    return res.status(500).json(result)
  }

  res.cookie('refreshToken', result.token.refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 100
  });

  return res.status(200).json({
    success: result.success,
    token: result.token.accessToken,
    admin_info: result.admin_info,
  });
}

let token = async (req, res) => {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    let data = await adminService.token(refreshToken);
  
    return res.status(200).json(data)
}

module.exports = {
    handleLogin: handleLogin,
    token: token
}