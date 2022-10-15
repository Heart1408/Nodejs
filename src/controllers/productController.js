import productService from '../services/productService';

let getListProduct = async (req, res) => {
  let listProduct = await productService.getListProduct();

  return res.status(200).json(listProduct);
}

let getInfoProduct = async (req, res) => {
  let productId = req.params.id;
  let data = await productService.getInfoProduct(productId);

  return res.status(200).json(data);
}

let addProductToCart = async (req, res) => {
  let productId = req.params.id;
  let userId = req.userId;
  let result = await productService.addProductToCart(productId, userId);

  return res.status(200).json(result);
}

//filter products
let filter = async (req, res) => {
  let { name, price, category, rate } = req.body

  if (!name && !price && !category && !rate) {
    return res.status(500).json({
      errCode: 1,
      message: 'Missing inputs parameter!',
    })
  }
  let data = await productService.filter(req.body);

  return res.status(200).json(data);
}

module.exports = {
  getListProduct: getListProduct,
  getInfoProduct: getInfoProduct,
  addProductToCart: addProductToCart,
  filter: filter,
}
