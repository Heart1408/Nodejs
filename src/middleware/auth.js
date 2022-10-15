import jwt from 'jsonwebtoken';

require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);

  if (!token)
    return res.sendStatus(401)

  try {
    const decode = jwt.verify(token, "mysecret")
    console.log(decode)
    req.userId = decode.id

    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized User' });
  }
}

module.exports = verifyToken;
