import db from '../models/index'

let getDetailOrder = (orderId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let listProduct = await db.OrderDetail.findAll({
                where: {
                    order_id: orderId
                },
                raw: true
            });

            if (listProduct) {
                resolve({
                    success: true,
                    listProduct: listProduct
                })
            }
            else {
                resolve({
                    success: false
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

let createOrder = (data, userId) => {
    return new Promise(async(resolve, reject) => {
        let address = data.address;
        let phone = data.phone;
        let receive_name = data.receiveName;
        let products = data.products;

        try {
            let order = await db.Order.create({
                user_id: userId,
                status: 1,
                address: address,
                phone: phone,
                receive_name: receive_name,
                ordertime: new Date()
            })
            
            for (let i = 0; i < products.length; i++) {
                await db.OrderDetail.create({
                    order_id: order.id,
                    product_id: products[i].id,
                    amount: products[i].amount
                })
            }

            if (order) {
                resolve({
                    success: true
                })
            }
            else {
                resolve({
                    success: false
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}

module.exports = {
    getDetailOrder: getDetailOrder,
    createOrder: createOrder
}