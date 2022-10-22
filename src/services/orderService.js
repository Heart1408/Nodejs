import db from '../models/index';

let getAllOrder = () => {
    return new Promise(async(resovle, reject) => {
        try {
            let listOrder = await db.Order.findAll({
                order: [
                    ['ordertime', 'DESC']
                ],
                raw: true
            });

            if (listOrder) {
                resovle({
                    success: true,
                    listAllOrder: listOrder
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

let changeStatusOrder = (orderId, status) => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.Order.update({
                status: status
            }, {
                where: {
                    id: orderId
                }
            })
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
            let isExist = await getOrder(orderId)
            if (!isExist.success) {
                resolve({
                    success: false,
                    errCode: 1,
                    message: 'Order is not exist!'
                })
            }
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

let orderHistory = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let listOrder = await db.Order.findAll({
                where: {
                    user_id: userId
                },
                raw: true
            })
            
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
            reject(e);
        }
    })
}

let getOrder = (orderId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let order = await db.Order.findOne({
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