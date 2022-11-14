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

module.exports = {
    addAddress: addAddress,
    getAllAddress: getAllAddress
}