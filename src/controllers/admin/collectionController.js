import collectionService from '../../services/admin/collectionService';

let getList = async (req, res) => {
  let result = await collectionService.getList();

  return res.status(200).json(result);
}

let create = async (req, res) => {
  let { name, description } = req.body

  if (!name || !description) {
    return res.status(500).json({
      success: false,
      errCode: 1,
      message: 'Missing inputs parameter!',
    })
  }
  let result = await collectionService.create(req.body);

  return res.status(200).json(result);
}

let update = async (req, res) => {
  let result = await collectionService.update(req.params.collectionId, req.body);

  return res.status(200).json(result);
}

let deleteCollection = async (req, res) => {
  let result = await collectionService.deleteCollection(req.params.collectionId);

  return res.status(200).json(result);
}

let getProduct = async (req, res) => {
  let result = await collectionService.getProduct(req.params.collectionId);

  return res.status(200).json(result);
}

let deleteProduct = async (req, res) => {
  let result = await collectionService.deleteProduct(req.body);

  return res.status(200).json(result);
}

let addProduct = async (req, res) => {
  let result = await collectionService.addProduct(req.body);

  return res.status(200).json(result);
}

module.exports = {
  getList: getList,
  create: create,
  update: update,
  deleteCollection: deleteCollection,
  getProduct: getProduct,
  deleteProduct: deleteProduct,
  addProduct: addProduct,
}
