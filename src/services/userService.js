import db from '../models/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

require('dotenv').config();

const salt = bcrypt.genSaltSync(10);

let handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isExist = await checkUserEmail(email)
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ['id', 'email', 'username', 'password'],
          where: { email: email },
          raw: true
        });

        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            //create JWT
            const accessToken = jwt.sign({
              email: user.email, id: user.id, role: "user"
            }, process.env.ACCESS_TOKEN_SECRET);

            const tokens = generateTokens(user)
            await db.User.update({ refresh_token: tokens.refreshToken }, {
              where: { id: user.id }
            });
            delete user.password;

            resolve({
              success: true,
              token: tokens,
              user_info: user
            })
          } else {
            resolve({
              success: false,
              errCode: 3,
              message: 'Wrong password'
            })
          }
        } else {
          resolve({
            success: false,
            errCode: 2,
            message: 'User is not found!'
          })
        }
      } else {
        resolve({
          success: false,
          errCode: 1,
          message: 'Email is not exist!'
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

const generateTokens = payload => {
  const { id, email } = payload
  const accessToken = jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15s'
  });
  const refreshToken = jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d'
  });

  return { accessToken, refreshToken };
}

let token = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findAll({
        where: { refresh_token: refreshToken }
      })

      if (!user[0]) {
        resolve({
          success: false,
          message: 'nmn'
        })
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        const id = user[0].id;
        const email = user[0].email;
        const accessToken = jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '15s'
        });

        resolve({
          success: true,
          token: accessToken
        })
      });
    } catch (e) {
      reject(e)
    }
  })
}

let register = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isEmailExist = await checkUserEmail(data.email)
      let isPhoneExist = await checkExistPhone(data.phone)

      if (data.password != data.confirmPassword) {
        userData.success = false;
        userData.errCode = 1;
        userData.errMessage = 'Password not confirm!';

        resolve(userData);
      } else if (isEmailExist || isPhoneExist) {
        userData.success = false;
        userData.errCode = 1;
        userData.errMessage = 'Email or phone number already exists!';

        resolve(userData);
      } else {
        try {
          let hashPasswordFromBcrypt = await bcrypt.hashSync(data.password, salt);
          await db.User.create({
            uername: data.username,
            email: data.email,
            phone: data.phone,
            password: hashPasswordFromBcrypt,
          })
          userData.success = true;
          userData.errMessage = 'Register Succeed!';
          let user = {
            username: data.username,
            email: data.email,
            phone: data.phone,
          }
          userData.user = user;

          resolve(userData);
        } catch (e) {
          reject(e);
        }
      }
    } catch (e) {
      reject(e);
    }
  })
}

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail }
      })
      if (user) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (e) {
      reject(e);
    }
  })
}

let checkExistPhone = (phone) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { phone: phone }
      })
      if (user) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (e) {
      reject(e);
    }
  })
}

let logout = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findAll({
        where: { refresh_token: refreshToken }
      });
      if (!user[0]) return res.sendStatus(204);
      const userId = user[0].id;
      await db.User.update({ refresh_token: null }, {
        where: { id: userId }
      });

      resolve({
        success: true,
        message: 'logout success!'
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  handleLogin: handleLogin,
  register: register,
  token: token,
  logout: logout,
}
