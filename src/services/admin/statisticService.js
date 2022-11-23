import db, { sequelize } from '../../models/index'

let getSaleWeek = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let week = new Date()
            week.setDate(week.getDate() - 14)
            let lastWeek = formatDate(week)
            console.log(week)
            let total = await db.Order.findAll({
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('delivery')), 'Date'],
                    [sequelize.fn('SUM', sequelize.col('OrderDetails->SizeShoe->Product.price') ), 'total']
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
                //
                where : sequelize.where( sequelize.fn('DATE', sequelize.col('delivery')), '>', lastWeek),
                group: 'Date',
                raw: true
            })

            if (total) {
                resolve({
                    success: true,
                    data: total
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