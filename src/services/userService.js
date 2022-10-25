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
              email: user.email, id: user.id
            }, process.env.ACCESS_TOKEN_SECRET);

            let data_user = await db.User.findOne({
              where: { id: user.id }
            })

            resolve({
              success: true,
              token: accessToken,
              user_info: data_user
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
          let createUser = await db.User.create({
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: hashPasswordFromBcrypt,
          })
          userData.success = true;
          userData.errMessage = 'Register Succeed!';

          let user = await db.User.findOne({ where: { id: createUser.id } });
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

module.exports = {
  handleLogin: handleLogin,
  register: register,
}
