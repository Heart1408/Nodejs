const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        //console.log(req);
        if (!req?.role) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = rolesArray.includes(req.role);
        if (!result) return res.status(401).json({ message: 'You do not have access' });
        next();
    }
}

module.exports = verifyRoles