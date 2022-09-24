const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');

const loginRouter = require('./routes/loginRouter');
const tradeRouter = require('./routes/tradeRouter');
const { verifyJwt } = require('./helpers/auth/verifyJwt');



const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/login', loginRouter)

app.use(verifyJwt)
app.use('/trade', tradeRouter)

app.listen(process.env.PORT || 5000, (port) => console.log('Server listening....'))



module.exports = app