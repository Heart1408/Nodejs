import productService from '../../services/admin/productService';

let create = async (req, res) => {
  let { name, price, image, description, categoryId } = req.body
  if (!name || !price || !image || !description || !categoryId) {
    return res.status(500).json({
      success: false,
      errCode: 1,
      message: 'Missing inputs parameter!',
    })
  }
  let result = await productService.createProduct(req.body);

  return res.status(200).json(result);
}

let update = async (req, res) => {
  let productId = req.params.productId;
  let result = await productService.updateProduct(productId, req.body);

  return res.status(200).json(result);
}

let deleteProduct = async (req, res) => {
  let productId = req.params.productId;
  let result = await productService.deleteProduct(productId);

  return res.status(200).json(result);
}

module.exports = {
  create: create,
  update: update,
  deleteProduct: deleteProduct,
}