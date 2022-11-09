import orderService from '../services/orderService'

let getAllOrder = async (req, res) => {
    let listAllOrder = await orderService.getAllOrder();

    return res.status(200).json(listAllOrder);
}
let changeStatusOrder = async (req, res) => {
    let orderId = req.body.orderId
    let status = req.body.status
    if (!orderId || !status) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }
    let order = await getOrder(orderId);
    if (!order) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: 'Order not found'
        })
    }

    if (req.role == "user") {
        if (req.id != order.user_id) {
            return res.status(401).json({
                success: false,
                errCode: 1,
                message: 'You do not have access!'
            })
        }
    }

    let success = await orderService.changeStatusOrder(orderId, status)

    return res.status(200).json(success);
}

let deleteOrder = async (req, res) => {
    let orderId = req.body.orderId
    if (!orderId) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }
    let success = await orderService.deleteOrder(orderId)

    return res.status(200).json(success);
}

let orderHistory = async (req, res) => {
    let userId = req.userId
    let status = req.params.status
    if (!status) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }
    let listOrder = await orderService.orderHistory(userId)

    return res.status(200).json(listOrder);
}

let getOrder = async (orderId) => {
    let order = await orderService.getOrder(orderId)
    if (order.success) {
        return order.order
    }
    return null
}

module.exports = {
    getAllOrder: getAllOrder,
    changeStatusOrder: changeStatusOrder,
    deleteOrder: deleteOrder,
    orderHistory: orderHistory
}