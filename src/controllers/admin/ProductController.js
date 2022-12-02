import productService from '../../services/admin/productService';

let create = async (req, res) => {
  let { name, price, description, categoryId } = req.body
  if (!name || !price || !req.file || !description || !categoryId) {
    return res.status(500).json({
      success: false,
      errCode: 1,
      message: 'Missing inputs parameter!',
    })
  }

  let result = await productService.createProduct(req.body, req.file.path);

  return res.status(200).json(result);
}

let update = async (req, res) => {
  let productId = req.params.productId;
  console.log(req.body);
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