import db, { sequelize } from '../../models/index'

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
                where : sequelize.where( sequelize.fn('DATE', sequelize.col('delivery')), '>', lastWeek),
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
                        dataLastWeek.push(total[j].total)
                        break
                    }                    
                }
                if (!dataLastWeek[i]) {
                    dataLastWeek.push('0')
                }
            }
            console.log(dataLastWeek)


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