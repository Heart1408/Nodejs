import db from '../models/index';
import orderDetailService from '../services/orderDetailService'
import reviewService from '../services/reviewService'

const limit = 12

let getPagination = (pageNumber) => {
    const offset = (pageNumber - 1) * limit;
    return offset;
}

let getAllOrder = (data) => {
    return new Promise(async(resovle, reject) => {
        try {
            let offset = data.pageNumber ? getPagination(data.pageNumber) : 0

            let { count, rows} = await db.Order.findAndCountAll({
                attributes: ['id', 'Address->User.username', 'Address.phone', 'Address.address', 'Address.receiver_name', 'status', 'ordertime', 'delivery'],
                include: [
                    {
                        model: db.Address,
                        required: true,
                        attributes: [],
                        include: [
                            {
                                model: db.User,
                                required: true,
                                attributes: []
                            }
                        ]
                    }
                ],
                where: 
                    data.orderStatus ? { status : data.orderStatus} : null
                ,
                offset,
                limit,
                order: [
                    data.sortByTime ? ['ordertime', data.sortByTime] : ['ordertime', 'DESC']
                ],
                raw: true
            });

            if (rows) {
                resovle({
                    success: true,
                    listAllOrder: rows
                })
            }
            else {
                resovle({
                    success: false
                })
            }
        } catch (e) {
            reject(e);
        }
    }) 
}

let getAllOrderMonth = (year) => {
    return new Promise(async(resolve, reject) => {
        try {
            
        } catch (e) {
            reject(e)
        }
    })
}

let changeStatusOrder = (orderId, status) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (status == 4) {
                await db.Order.update({
                    status: status,
                    delivery: new Date()
                }, {
                    where: { id: orderId }
                })
            } else {
                await db.Order.update({
                    status: status
                }, {
                    where: {
                        id: orderId
                    }
                })
            }
            resolve({
                success: true
            })
        } catch (e) {
            reject(e)
        }
    })
} 

let deleteOrder = (orderId) => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.Order.destroy({
                where: {
                    id: orderId
                }
            })
            resolve({
                success: true
            })
        } catch(e) {
            reject(e)
        }
    })
}

let orderHistory = (userId, status) => {
    return new Promise(async(resolve, reject) => {
        try {
            let result = await getOrderUser(userId);
            if (status != 0 && result.success) {
                result.listOrder = result.listOrder.filter(order => order.status == status)
            }
            
            if (result) {
                resolve(result)
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

let getOrderUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let listOrder = await db.Order.findAll({
                attributes: ['id', 'Address->User.username', 'Address.phone', 'Address.address', 'Address.receiver_name', 'status', 'ordertime', 'delivery'],
                include: [
                    {
                        model: db.Address,
                        required: true,
                        attributes: [],
                        include: [
                            {
                                model: db.User,
                                required: true,
                                attributes: []
                            }
                        ]
                    }
                ],
                order: [
                    ['ordertime', 'DESC']
                ],
                where: {
                    '$Address.user_id$': userId
                },
                raw: true
            })

            for (let i = 0; i < listOrder.length; i++) {
                let listProduct = await orderDetailService.getDetailOrder(listOrder[i].id)
                listOrder[i].listProducts = listProduct.listProduct
            }
            if (listOrder) {
                resolve({
                    success: true,
                    listOrder: listOrder
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

let getOrder = (orderId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let order = await db.Order.findOne({
                attributes: ['id', 'Address.user_id', 'Address.phone', 'Address.address', 'Address.receiver_name', 'status', 'ordertime', 'delivery'],
                include: [
                    {
                        model: db.Address, 
                        required: true,
                        attributes: []
                    }

                ],
                where : {
                    id: orderId
                },
                raw: true
            })
            if (order) {
                resolve({
                    success: true,
                    order: order
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

module.exports = {
    getAllOrder: getAllOrder,
    changeStatusOrder: changeStatusOrder,
    deleteOrder: deleteOrder,
    orderHistory: orderHistory,
    getOrder: getOrder
}