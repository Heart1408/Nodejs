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

module.exports = {
    addAddress: addAddress
}