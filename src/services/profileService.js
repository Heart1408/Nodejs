import db from '../models/index'

let getProfile = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let profile = await db.User.findOne({
                attributes: ['username', 'name', 'email', 'phone', 'avatar'],
                where: {
                    id: userId
                }
            })

            if (profile) {
                resolve({
                    success: true,
                    profile: profile
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

let updateProfile = (data, image) => {
    return new Promise(async(resolve, reject) => {
        try {
            let result = await db.User.update({
                username: data.username,
                name: data.name,
                email: data.email,
                phone: data.phone,
                avatar: image
            }, {
                where: {
                    id: data.userId
                }
            })

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

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile
}