const jwt = require('jsonwebtoken')

const verifyJwt = (req, res, next) => {
    let authHeader = req.headers.authorization
    if (authHeader == undefined) return res.status(401).send({ error: 'No token' })

    let token = authHeader.split(' ')[1]

    jwt.verify(token, 'trade_secret_123', (err, decoded) => {
        if (err) { res.status(500).send({ err: 'Auth failed' }) }
        else {
            // let resp = { id: decoded.id, username: decoded.username }
            // res.cookie("refreshToken", jwt.sign(resp, "trade_secret_123", { expiresIn: 600 }), {
            //     httpOnly: true,
            //     // path: "/refresh-token",
            // });
            next();
        }
    })
}

module.exports = { verifyJwt }