const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;
    if (req?.headers?.authorization.startsWith('Bearer')) {
        const accessToken = token.split(' ')[1];
        jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid access token',
                });
            }
            console.log('user: ', user);
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Require authentication',
        });
    }
});

const checkIsStaff = asyncHandler(async (req, res, next) => {
    const { isAdmin, role } = req.user;
    if (role !== 'staff') {
        res.status(401).json({
            success: false,
            message: 'Require admin role',
        });
    }
    next();
});

const checkIsAdmin = asyncHandler(async (req, res, next) => {
    const { isAdmin, role } = req.user;
    console.log('isAdmin: ', isAdmin);
    console.log('role: ', role);
    if (isAdmin === false && role !== 'admin') {
        res.status(401).json({
            success: false,
            message: 'Require admin role',
        });
    }
    if (isAdmin === true || role === 'admin') next();
});

module.exports = { verifyAccessToken, checkIsStaff, checkIsAdmin };
