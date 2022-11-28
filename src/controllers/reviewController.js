import reviewService from '../services/reviewService';

let getList = async (req, res) => {
  let productId = req.params.productId;
  let result = await reviewService.getList(productId);

  return res.status(200).json(result);
}

let create = async (req, res) => {
  let userId = req.userId;
  let { productId, rate, comment } = req.body

  if (!productId || !rate || !comment) {
    return res.status(500).json({
      success: false,
      errCode: 1,
      message: 'Missing inputs parameter!',
    })
  }

  let result = await reviewService.create(userId, req.body);
  return res.status(200).json(result);
}

let edit = async (req, res) => {
  let userId = req.userId;

  let result = await reviewService.edit(userId, req.body);
  return res.status(200).json(result);
}

let deleteReview = async (req, res) => {
  let userId = req.userId;
  let productId = req.body.productId
  let result = await reviewService.deleteReview(userId, productId);

  return res.status(200).json(result);
}

module.exports = {
  getList: getList,
  create: create,
  edit: edit,
  delete: deleteReview,
}
