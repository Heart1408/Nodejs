import db from '../models/index'

let addAdress = (userId, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let address = data.address;
            let phone = data.phone;
            let name = data.receiverName;

            let userInfo = await db.Address.create({
                address: address,
                phone: phone,
                receiver_name: name,
                user_id: userId
            })

            if (userInfo) {
                resolve({
                    success: true
                })
            }
            else {
                resolve({
                    success:  false
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    addAdress: addAdress
}