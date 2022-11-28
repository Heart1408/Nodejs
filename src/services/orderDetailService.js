import { ModulesOption } from '@babel/preset-env/lib/options';
import db, { sequelize } from '../models/index'

let getDetailOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listProduct = await db.OrderDetail.findAll({
                attributes: ['id', 'amount', 'SizeShoe.product_id', 'SizeShoe->Product.name', 'SizeShoe->Product.description', 'SizeShoe->Product.image', 'SizeShoe->Product.price', 'SizeShoe->Size.size'],
                include: [
                    {
                        model: db.SizeShoe,
                        required: true,
                        attributes: [],
                        include: [
                            {
                                model: db.Product,
                                required: true,
                                attributes: []
                            },
                            {
                                model: db.Size,
                                required: true,
                                attributes: []
                            }

                        ]
                    }
                ],
                where: {
                    order_id: orderId
                },
                raw: true
            })

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
        } catch (e) {
            reject(e)
        }
    })
}

let createOrder = (products, address, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = await db.Order.create({
                userInfo: address,
                status: 1,
                ordertime: new Date()
            })

            let detailData = []

            for (let i = 0; i < products.length; i++) {
                let productSize = await getProductSizeId(products[i].id, products[i].size)
                let record = {
                    order_id: order.id,
                    product_size_id: productSize.id,
                    amount: products[i].amount
                }
                await db.SizeShoe.update({
                    amount: productSize.amount - products[i].amount
                }, {
                    where: {
                        id: productSize.id
                    }
                })
                let cart = await db.Cart.findOne({
                    where: {
                        user_id: userId,
                        sizeshoe_id: productSize.id
                    },
                    raw: true
                })
                if (cart) {
                    await db.Cart.destroy({
                        where: {
                            id: cart.id
                        }
                    })
                }
                detailData.push(record);                
            }
            
            db.OrderDetail.bulkCreate(detailData)

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
        } catch (e) {
            reject(e);
        }
    })
}

let getProductSizeId = async(productId, sizeId) => {
    let id = await db.SizeShoe.findOne({
        where: {
            product_id: productId,
            size_id: sizeId
        },
        raw: true
    })
    return id
}

module.exports = {
    getDetailOrder: getDetailOrder,
    createOrder: createOrder,
    getProductSizeId: getProductSizeId
}