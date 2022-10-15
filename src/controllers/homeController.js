import db from '../models/index';
import crudService from '../services/crudService';

let getHomepage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    console.log(data);
    return res.render('index.ejs', {
      data: JSON.stringify(data)
    });
  } catch (e) {
    console.log(e)
  }
}

let getCRUD = async (req, res) => {
  return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
  let message = await crudService.createNewUser(req.body);
  console.log(message);
  return res.send('post crud');
}

let displayCRUD = async (req, res) => {
  let data = await crudService.getAllUser();
  return res.render('crud.ejs', {
    dataTable: data,
  });
}

let editCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await crudService.getUserInfoById(userId);

    return res.render('editUser.ejs', {
      user: userData,
    });
  } else {
    return res.send('user not found!');
  }
}

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await crudService.updateUserData(data);
  return res.render('crud.ejs', {
    dataTable: allUsers,
  });
}

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await crudService.deleteUserById(id);
  } else {
    return res.send('user not found!');
  }
  return res.send('delete secceed!');
}

module.exports = {
  getHomepage: getHomepage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayCRUD: displayCRUD,
  editCRUD: editCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
}
