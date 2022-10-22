import orderDetailService from "../services/orderDetailService"
import orderService from "../services/orderService"

let getDetailOrder = async(req, res) => {
    let orderId = req.params.id
    if (!orderId) {
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
    let listProduct = await orderDetailService.getDetailOrder(orderId)

    return res.status(200).json(listProduct);
}

let createOrder = async(req, res) => {
    let data = req.body;
    let userId = req.userId;
    if (!data || !data.address ||!data.phone || !data.receive_name ||!data.products) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }
    let success = await orderDetailService.createOrder(data, userId)

    return res.status(200).json(success);
}

let getAmountSoldProducts = async(req, res) => {
    let listProduct = await orderDetailService.getAmountSoldProducts();

    return res.status(200).json(listProduct);
}

let getOrder = async(orderId) => {
    let order = await orderService.getOrder(orderId)
    if (order.success) {
        return order.order
    }
    return null
}

module.exports = {
    getDetailOrder: getDetailOrder,
    createOrder: createOrder,
    getAmountSoldProducts: getAmountSoldProducts
}