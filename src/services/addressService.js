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

            if (data.default) {
                await updateAddressDefault(userId, userInfo.dataValues.id)
            }

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
            let addressList = await db.User.findAll({
                attributes: ['address_default', 'Addresses.id', 'Addresses.address', 'Addresses.phone', 'Addresses.receiver_name'],
                include: [
                    {
                        model: db.Address,
                        required: true,
                        attributes: []
                    }
                ],
                where: {
                    id: userId
                },
                raw: true
            })
            
            addressList.forEach(element => {
                if (element.address_default == element.id) {
                    element.address_default = true
                } else {
                    element.address_default = false
                }
            });
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

let updateAddress = (userId, data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let result = await db.Address.update({
                address: data.address,
                phone: data.phone,
                receiver_name: data.receiverName
            }, {
                where: {
                    id: data.addressId
                }
            })

            if (data.address_default) {
                updateAddressDefault(userId, data.addressId)
            }

            if (result) {
                resolve({
                    success: true
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

let deleteAddress = (addressId) => {
    return new Promise(async(resolve, reject) => {
        try {
            await db.Address.destroy({
                where: {
                    id: addressId
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

let getAddressDefault = async(userId) => {
    let user = await db.User.findOne({
        where: {
            id: userId
        }
    })
    return user.address_default
}

let updateAddressDefault = async(userId, addressId) => {
    await db.User.update({
        address_default: addressId
    },
    {
        where: {
            id: userId
        }
    })
}

let getAddress = (addressId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let address = await db.Address.findOne({
                where: {
                    id: addressId
                }
            })

            if (address) {
                resolve({
                    success: true,
                    address: address
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

module.exports = {
    addAdress: addAdress,
    getAllAddress: getAllAddress,
    updateAddress: updateAddress,
    getAddress: getAddress,
    deleteAddress: deleteAddress
}