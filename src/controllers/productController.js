import productService from '../services/productService';

let getListProduct = async (req, res) => {
  let listProduct = await productService.getListProduct(req.body);

  return res.status(200).json(listProduct);
}

let getInfoProduct = async (req, res) => {
  let productId = req.params.id;
  let data = await productService.getInfoProduct(productId);

  return res.status(200).json(data);
}

let addProductToCart = async (req, res) => {
  let productId = req.params.productId;
  let sizeId = req.params.sizeId;
  let userId = req.userId;
  let result = await productService.addProductToCart(productId, sizeId, userId);

  return res.status(200).json(result);
}

let getRecommendedProduct = async (req, res) => {
  let categoryId = req.params.id;
  let data = await productService.getRecommendedProduct(categoryId);

  return res.status(200).json(data);
}

module.exports = {
  getListProduct: getListProduct,
  getInfoProduct: getInfoProduct,
  addProductToCart: addProductToCart,
  getRecommendedProduct: getRecommendedProduct,
}
