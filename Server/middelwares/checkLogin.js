const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    console.log('headers -> ', req.headers)
    const {authorization} = req.headers;
    console.log('auth -> ',authorization)

    try{
        const token = authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {userName, userId} = decoded;
        req.userName = userName;
        req.userId = userId;
        next()
    }
    catch(err){
        next(err)
    }
}

module.exports = checkLogin;