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
        if (req.userId != order.user_id) {
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
    if (!data || !data.address ||!data.products) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    for (let i = 0; i < data.products.length; i++) {
        let quantityInStock = await orderDetailService.getProductSizeId(data.products[i].product_id, data.products[i].size_id)
        if (data.products[i].amount > quantityInStock.amount) {
            return res.status(500).json({
                success: false,
                errCode: 2,
                message: "Sản phẩm vượt quá số lượng"
            })
        }
    }
    let success = await orderDetailService.createOrder(data.products, data.address, req.userId)

    return res.status(200).json(success);
}

let getOrder = async(orderId) => {
    let order = await orderService.getOrder(orderId)
    console.log(order);
    if (order.success) {
        return order.order
    }
    return null
}

module.exports = {
    getDetailOrder: getDetailOrder,
    createOrder: createOrder
}