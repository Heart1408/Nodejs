import orderService from '../services/orderService'

let getAllOrder = async(req, res) => {
    let listAllOrder = await orderService.getAllOrder();

    return res.status(200).json(listAllOrder);
}
let changeStatusOrder = async (req, res) => {
    let orderId = req.body.orderId
    let status = req.body.status
    let success = await orderService.changeStatusOrder(orderId, status)

    return res.status(200).json(success);
}

let deleteOrder = async (req, res) => {
    let orderId = req.body.orderId
    let success = await orderService.deleteOrder(orderId)

    return res.status(200).json(success);
}

let orderHistory = async(req, res) => {
    let userId = req.userId
    let listOrder = await orderService.orderHistory(userId)

    return res.status(200).json(listOrder);
}


module.exports = {
    getAllOrder: getAllOrder,
    changeStatusOrder: changeStatusOrder,
    deleteOrder: deleteOrder,
    orderHistory: orderHistory
}