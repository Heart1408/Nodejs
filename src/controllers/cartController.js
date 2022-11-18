import cartService from '../services/cartService';

let deleteProduct = async (req, res) => {
  let productId = req.params.productId;
  let userId = req.userId;
  let result = await cartService.deleteProduct(productId, userId);

  return res.status(200).json(result);
}

let changeAmount = async (req, res) => {
  let userId = req.userId;
  let result = await cartService.changeAmount(req.query, userId);

  return res.status(200).json(result);
}

module.exports = {
  deleteProduct: deleteProduct,
  changeAmount: changeAmount
}
