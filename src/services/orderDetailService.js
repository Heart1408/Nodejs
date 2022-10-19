import { ModulesOption } from '@babel/preset-env/lib/options';
import db, { sequelize } from '../models/index'

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

let getAmountSoldProducts = () => {
    return new Promise(async(resolve, reject) => {
        try {
            
            let productList = await db.Product.findAll({
                attributes: ['id', 'name', 'description', 'image', 'amount', 'price', [db.sequelize.fn('sum', db.sequelize.col('OrderDetails.amount')), 'total_sold']],
                include: [
                    {
                        model: db.OrderDetail,
                        required: true,
                        attributes: []
                    }
                ],
                group: ['Product.id'],
                raw: true
            })

            productList.forEach(element => {
                element.total_sold = parseInt(element.total_sold)
            });
            

            /** 
            let productList = await sequelize.query("select product_id, P.name, sum(OrderDetails.amount) as sum from OrderDetails join Products P on P.id = OrderDetails.product_id GROUP BY product_id",
                {type: sequelize.QueryTypes.SELECT});
            
            
            let productList = await db.Product.findAll({
                raw: true
            });
            for (let i=0; i<productList.length; i++)
            {
                productList[i].totalSold = await db.OrderDetail.sum('amount', {
                    where: {
                        product_id: productList[i].id
                    }
                })
                console.log(productList[i].totalSold);
            }
            */
            
            if (productList) {
                console.log(productList);
                resolve({
                    success: true,
                    productList: productList
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

module.exports = {
    getDetailOrder: getDetailOrder,
    createOrder: createOrder,
    getAmountSoldProducts: getAmountSoldProducts
}