import statisticService from '../../services/admin/statisticService'

let getSale = async(req, res) => {
    let result = await statisticService.getSaleWeek()

    return res.status(200).json(result)
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
    getSale: getSale
}