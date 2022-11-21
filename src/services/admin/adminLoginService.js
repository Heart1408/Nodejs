import db from '../../models/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

require('dotenv').config();

const salt = bcrypt.genSaltSync(10);

let handleLogin = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
        let admin = await db.Admin.findOne({
            where: { username: username },
            raw: true
        });

        if (admin) {
            let check = await bcrypt.compareSync(password, admin.password);
            if (check) {
                const tokens = generateTokens(admin)
                await db.Admin.update({ refresh_token: tokens.refreshToken }, {
                    where: { id: admin.id }
                });
                delete admin.password;

                resolve({
                    success: true,
                    token: tokens,
                    admin_info: admin
                })
            } else {
            resolve({
                success: false,
                errCode: 3,
                message: 'Incorrect username or password!'
            })
            }
        } else {
            resolve({
            success: false,
            errCode: 2,
            message: 'Incorrect username or password!'
            })
        }
    } catch (e) {
      reject(e);
    }
  })
}

const generateTokens = payload => {
  const { id, email } = payload
  const accessToken = jwt.sign({ id, email, role: "admin" }, process.env.ACCESS_TOKEN_SECRET);
  const refreshToken = jwt.sign({ id, email, role: "admin" }, process.env.REFRESH_TOKEN_SECRET, {
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
        const accessToken = jwt.sign({ id, email, role: "admin" }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '150s'
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

module.exports = {
    handleLogin: handleLogin,
    token: token
}