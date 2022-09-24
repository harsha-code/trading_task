let express = require('express');
const fs = require('fs');

let router = express.Router()

const tradeDataJsonPath = './db/tradeData.json'

router.post('/', (req, res) => {
    console.log(req.body)
    let { type, user_id, symbol, shares, price } = req.body

    if (!type || !user_id || !symbol || !shares || !price) {
        return res.sendStatus(400)
    }
    else if (Number(shares) > 100 || Number(shares) < 0 || !['buy', 'sell'].includes(type)) {
        return res.sendStatus(400)
    } else {

        let tradeData = []
        fs.readFile(tradeDataJsonPath, (err, data) => {
            if (err) throw err;
            tradeData = JSON.parse(data);
            let tradeObject = {
                id: tradeData.length + 1,
                type,
                user_id,
                symbol,
                shares,
                price,
                timestamp: new Date().getTime()
            }

            tradeData.push(tradeObject)
            let tradeDataJson = JSON.stringify(tradeData);

            fs.writeFileSync(tradeDataJsonPath, tradeDataJson);
            res.status(201)
            res.send(tradeObject)
        });


    }
})


router.get('/', (req, res) => {
    let { type, user_id } = req.query

    fs.readFile(tradeDataJsonPath, async (err, data) => {
        if (err) throw err;
        tradeData = await JSON.parse(data);
        tradeData.sort((a, b) => a.id - b.id)

        if (type && user_id) {
            console.log(type, user_id)
            let queryTrade = tradeData.filter((trade) => trade.type == type && trade.user_id == user_id)
            res.send(queryTrade)
        } else {
            res.send(tradeData)
        }

    });
})

router.get('/:id', (req, res) => {
    let { id } = req.params
    console.log(id)
    fs.readFile(tradeDataJsonPath, async (err, data) => {
        if (err) throw err;
        tradeData = await JSON.parse(data);
        tradeData.sort((a, b) => a.id - b.id)

        let tradeObj = tradeData.find(a => a.id == id)
        if (tradeObj) {
            return res.send(tradeObj)
        } else {
            res.sendStatus(404)
        }
    });
})

router.delete('/:id', (req, res) => {
    res.sendStatus(405)
})
router.put('/:id', (req, res) => {
    res.sendStatus(405)
})
router.patch('/:id', (req, res) => {
    res.sendStatus(405)
})

module.exports = router