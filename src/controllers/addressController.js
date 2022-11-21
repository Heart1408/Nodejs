import addressService from '../services/addressService'

let addAddress = async(req, res) => {
    if (!req.userId || !req.body.phone || !req.body.address || !req.body.receiverName) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: "Missing inputs paremeter"
        })
    }

    let success = await addressService.addAdress(req.userId, req.body)

    return res.status(200).json(success)
}

let getAllAddress = async(req, res) => {
    let result = await addressService.getAllAddress(req.userId)

    return res.status(200).json(result)
}

let updateAddress = async(req, res) => {
    if (!req.body.addressId || !req.body.address || !req.body.phone || !req.body.receiverName) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: "Missing inputs paremeter"
        })
    }

    let address = await getAddress(req.body.addressId)

    if (!address) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: 'Address not found'
        })
    }

    if (req.userId  != address.user_id) {
        return res.status(401).json({
            success: false,
            errCode: 1,
            message: 'You do not have access!'
        })
    }

    let result = await addressService.updateAddress(req.userId, req.body)

    return res.status(200).json(result)
}

let deleteAddress = async(req, res) => {
    if (!req.body.addressId) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: "Missing inputs paremeter"
        })
    }

    let address = await getAddress(req.body.addressId)

    if (!address) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: 'Address not found'
        })
    }

    if (req.userId  != address.user_id) {
        return res.status(401).json({
            success: false,
            errCode: 1,
            message: 'You do not have access!'
        })
    }

    let result = await addressService.deleteAddress(req.body.addressId)

    return res.status(200).json(result)
}

let getAddress = async(addressId) => {
    let address = await addressService.getAddress(addressId)

    if (address.success) {
        return address.address
    }
    return null
}

module.exports = {
    addAddress: addAddress,
    getAllAddress: getAllAddress,
    updateAddress: updateAddress,
    deleteAddress: deleteAddress
}