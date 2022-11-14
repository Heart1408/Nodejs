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

let getAllAddress = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let addressList = await db.Address.findAll({
                attribute: ['id','address', 'phone', 'receiver_name', 'user_id'],
                include: [
                    {
                        model: db.User,
                        required: true,
                        attribute: ['address_default']
                    }
                ],
                where: {
                    user_id: userId
                },
                raw: true
            })
            console.log(addressList)
            if (addressList) {
                resolve({
                    success: true,
                    addressList: addressList
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
    addAdress: addAdress,
    getAllAddress: getAllAddress
}