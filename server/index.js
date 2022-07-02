const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT')

const registerCtrl = require('./controller/registerCtrl')
const authCtrl = require('./controller/authCtrl')
const employeesCtrl = require('./controller/employessCtrl')
const refreshTokenCtrl = require('./controller/refresTokenCtrl')


const app = express()
app.use(express.json())
app.use(cors(corsOptions));

app.use(cookieParser())


app.post('/register', registerCtrl.handleNewUser)
app.post('/login', authCtrl.handeLogin)
app.post('/refresh', refreshTokenCtrl.refreshToken)


app.use(verifyJWT)

app.get('/employees', employeesCtrl)


app.listen(3500, console.log("server listening on 3500"))

