import profileService from '../services/profileService'

let getProfile = async(req, res) => {
    if (!req.params.userId) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: "Missing inputs paremeter"
        })
    }

    if (req.role == 'user' && req.params.userId != req.userId) {
        return res.status(401).json({
            success: false,
            errCode: 1,
            message: 'You do not have access!'
        })
    }

    let profile = await profileService.getProfile(req.params.userId)

    return res.status(200).json(profile)
}
let updateProfile = async(req, res) => {
    if (!req.body.userId || !req.body.email || !req.body.name || !req.body.username || !req.body.phone) {
        return res.status(500).json({
            success: false,
            errCode: 1,
            message: "Missing inputs paremeter"
        })
    }

    if (req.role == 'user' && req.body.userId != req.userId) {
        return res.status(401).json({
            success: false,
            errCode: 1,
            message: 'You do not have access!'
        })
    }

    let result = await profileService.updateProfile(req.body)

    return res.status(200).json(result)
}

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile
}