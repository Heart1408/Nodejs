import categoryService from '../services/categoryService';

let getList = async (req, res) => {
  let result = await categoryService.getListCategory();

  return res.status(200).json(result);
}

module.exports = {
  getList: getList,
}
