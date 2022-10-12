import db from '../models/index';
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);

let handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email)
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ['email', 'username', 'password'],
          where: { email: email },
          raw: true
        });

        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = 'OK';
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = 'Wrong password';
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = 'User is not found!';
        }

        resolve(userData);
      } else {
        userData.errCode = 1;
        userData.errMessage = 'Email is not exist!';

        resolve(userData);
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
        userData.errCode = 1;
        userData.errMessage = 'Password not confirm!';

        resolve(userData);
      } else if (isEmailExist || isPhoneExist) {
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
          userData.errCode = 0;
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

module.exports = {
  handleLogin: handleLogin,
  register: register,
}

