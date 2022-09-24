let express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs');


let router = express.Router()

const usersJsonPath = './db/users.json'

router.post('/', (req, res) => {


    let { email, password } = req?.body
    console.log(email, password)
    if (!email || !password) { return res.sendStatus(400) }


    fs.readFile(usersJsonPath, async (err, data) => {
        if (err) throw err;
        let users = await JSON.parse(data);

        let user = users.find(user => user.email == email)
        if (!user) return res.sendStatus(400)

        if (user.password == password) {
            const accessToken = jwt.sign({ email, id: 123 }, "trade_secret_123", { expiresIn: 600 })
            const refreshToken = jwt.sign({ email, id: 123 }, "trade_secret_123", { expiresIn: "1y" })
            return res.status(200).send({ auth: true, accessToken, refreshToken })
        }
        else {
            return res.sendStatus(400)
        }


    });



})

router.post('/refreshToken', (req, res) => {
    let { refreshToken } = req.body
    console.log(refreshToken)

    if (!refreshToken) return res.sendStatus(400)
    jwt.verify(refreshToken, 'trade_secret_123', (err, decoded) => {
        if (err) { res.status(500).send({ err: 'Auth failed' }) }
        else {
            let resp = { id: decoded.id, username: decoded.username }
            let accessToken = jwt.sign(resp, "trade_secret_123", { expiresIn: 600 })
            res.send(accessToken)
        }
    })

})


module.exports = router