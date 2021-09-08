const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).json({
            message: 'Unauthorized'
        });


    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    jwt.verify(token, process.env.SECRET_PASS_AUTH, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }

        req.user = decoded.user;
        return next();
    });
};
