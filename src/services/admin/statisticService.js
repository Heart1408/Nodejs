import db, { sequelize } from '../../models/index'
const { Op } = require("sequelize");

let getSaleWeek = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let week = new Date()
            week.setDate(week.getDate() - 14)
            let lastWeek = formatDate(week)
            let total = await db.Order.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('delivery')), 'Date'],
                    [sequelize.fn('SUM', sequelize.where(sequelize.col('OrderDetails->SizeShoe->Product.price'), '*' ,sequelize.col('OrderDetails.amount'))), 'total']
                ],
                include: [
                    {
                        model: db.OrderDetail,
                        required: true,
                        attributes: [],
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
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where : sequelize.where( sequelize.fn('DATE', sequelize.col('delivery')), '>=', lastWeek),
                group: 'Date',
                raw: true
            })

            let todayDay = new Date().getDay()
            if (todayDay == 0) {
                todayDay = 6
            } else {
                todayDay = todayDay - 1
            }
            let mondayLastWeek = new Date()
            mondayLastWeek.setDate(mondayLastWeek.getDate() - 8 - todayDay)
            let dataLastWeek = []
            for (let i = 0; i < 7; i++) {
                mondayLastWeek.setDate(mondayLastWeek.getDate() + 1)
                for (let j = 0; j < total.length; j++) {
                    if (total[j].Date == formatDate(mondayLastWeek)) {
                        dataLastWeek.push(parseInt(total[j].total))
                        break
                    }                    
                }
                if (!dataLastWeek[i]) {
                    dataLastWeek.push(0)
                }
            }

            let mondayCurrentWeek = new Date()
            mondayCurrentWeek.setDate(mondayCurrentWeek.getDate() - 1 - todayDay)
            let dataCurrentWeek = []
            for (let i = 0; i < 7; i++) {
                mondayCurrentWeek.setDate(mondayCurrentWeek.getDate() + 1)
                for (let j = 0; j < total.length; j++) {
                    if (total[j].Date == formatDate(mondayCurrentWeek)) {
                        dataCurrentWeek.push(parseInt(total[j].total))
                    }
                }
                if (!dataCurrentWeek[i]) {
                    dataCurrentWeek.push(0)
                }
            }

            let data = {}
            
            data.currentDay = dataCurrentWeek[todayDay] //Doanh thu trong ng??y
            let yesterday = todayDay == 0 ? dataLastWeek[6] : dataCurrentWeek[todayDay - 1]
            data.currentDayRatio = yesterday != 0 ? dataCurrentWeek[todayDay] * 100 / yesterday : 100 //Ph???n tr??m t??ng doanh thu trong ng??y so v???i h??m tr?????c

            data.totalUser = await totalUser() //T???ng user

            let newUser = await newUserMonth()
            data.newUserCurrentMonth = newUser.newUserCurrentMonth //User m???i trong th??ng
            data.newUserRatio = newUser.newUserLastMonth != 0 ? newUser.newUserCurrentMonth * 100 / newUser.newUserLastMonth : 100 //Ph???n tr??m t??ng s??? user m???i so v???i th??ng tr?????c

            

            let newOrder = await newOrderDay()
            data.newOrderCurrentDay = newOrder.newOrderCurrentDay //????n h??ng m???i trong ng??y
            data.newOrderRatio = newOrder.newOrderLastDay != 0 ? newOrder.newOrderCurrentDay * 100 / newOrder.newOrderLastDay : 100 //Ph???n tr??m t??ng s??? ????n h??ng m???i s?? v???i h??m tr?????c

            data.ordersMonth = await orderMonth() //????n h??ng theo t???ng th??ng trong n??m

            data.lastWeek = dataLastWeek //Doanh thu tu???n tr?????c
            data.currentWeek = dataCurrentWeek //Doanh thu tu???n n??y

            data.totalOrder = await totalOrder() //T???ng ????n h??ng
            data.totalSale = await totalSale() //T???ng doanh thu
            data.totalProduct = await totalProduct() //T???ng s???n ph???m

            if (total) {
                resolve({
                    success: true,
                    data: data
                })
            } else {
                resolve({
                    success: false
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let userMonth = async(month, year) => {
    let userCount = await db.User.count({
        where : {
            [Op.and] : [
                sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), month),
                sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), year)
            ]
        }
    })
    return userCount
}

let newUserMonth = async() => {
    let today = new Date()
    let newUserCurrentMonth = await userMonth(today.getMonth() + 1, today.getFullYear())
    let lastMonth = 12
    let year = today.getFullYear() - 1
    if (today.getMonth() != 12) {
        lastMonth = today.getMonth()
        year++
    }
    let newUserLastMonth = await userMonth(lastMonth, year)
    return {newUserCurrentMonth, newUserLastMonth}
}

let totalUser = async() => {
    let total = await db.User.count()
    return total
}

let orderDay = async(date) => {
    let orderCount = await db.Order.count({
        where: sequelize.where(sequelize.fn('DATE', sequelize.col('ordertime')), date)
    })
    return orderCount
} 

let newOrderDay = async() => {
    let today = new Date()
    let newOrderCurrentDay = await orderDay(formatDate(today))
    today.setDate(today.getDate() - 1)
    let newOrderLastDay = await orderDay(formatDate(today))
    return {newOrderCurrentDay, newOrderLastDay}
}

let orderMonth = async() => {
    let today = new Date()
    let orders = await db.Order.findAll({
        attributes: [
            [sequelize.fn('MONTH', sequelize.col('ordertime')), 'Month'],
            [sequelize.fn('COUNT', sequelize.col('ordertime')), 'orders']
        ],
        where : sequelize.where(sequelize.fn('YEAR', sequelize.col('ordertime')), '=', today.getFullYear()),
        group: 'Month',
        raw: true
    })

    let ordersMonth = []
    for (let i = 0; i < 12; i++) {
        let o = orders.find(element => element.Month == i + 1)
        if (o) {
            ordersMonth.push(parseInt(o.orders))
        } else {
            ordersMonth.push(0)
        }
    }

    return ordersMonth
}

let totalOrder = async() => {
    let total = await db.Order.count()
    return total
}

let totalProduct = async() => {
    let total = await db.Product.count()
    return total
}

let totalSale = async() => {
    let total = await db.Order.findAll({
        attributes: [
            [sequelize.fn('SUM', sequelize.where(sequelize.col('OrderDetails->SizeShoe->Product.price'), '*' ,sequelize.col('OrderDetails.amount'))), 'total']
        ],
        include: [
            {
                model: db.OrderDetail,
                required: true,
                attributes: [],
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
                            }
                        ]
                    }
                ]
            }
        ],
        where : {
            delivery: {
                [Op.not]: null
            }
        },
        raw: true
    })
    return parseInt(total[0].total)
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-');
}

module.exports = {
    getSaleWeek: getSaleWeek
}