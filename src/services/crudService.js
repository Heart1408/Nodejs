import bcrypt from 'bcrypt';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);
const { resolveInclude } = require("ejs");

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        password: hashPasswordFromBcrypt,
        phone: data.phone,
      })

      resolve('ok create a new user succeed!')
    } catch (e) {
      reject(e);
    }
  })
}

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  })
}

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  })
}

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      })

      if (user) {
        resolve(user)
      } else {
        resolve([])
      }

    } catch (e) {
      reject(e);
    }
  })
}

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id }
      })

      if (user) {
        user.firstName = data.firstname;
        user.lastName = data.lastname;
        user.address = data.address;
        user.phone = data.phone;
        user.email = data.email;

        await user.save();

        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  })
}

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId }
      })

      if (user) {
        await user.destroy();
      }

      resolve();
    } catch (e) {
      reject(e);
    }
  })
}

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
}
