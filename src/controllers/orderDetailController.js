import orderDetailService from "../services/orderDetailService"

let getDetailOrder = async(req, res) => {
    let orderId = req.params.id
    let listProduct = await orderDetailService.getDetailOrder(orderId)

    return res.status(200).json(listProduct);
}

let createOrder = async(req, res) => {
    let data = req.body;
    let userId = req.userId;
    let success = await orderDetailService.createOrder(data, userId)

    return res.status(200).json(success);
}

module.exports = {
    getDetailOrder: getDetailOrder,
    createOrder: createOrder
}