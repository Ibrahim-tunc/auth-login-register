const express = require('express')
const router = express.router()
const registerCtrl = require('../controller/registerCtrl.js')

router.post('/', registerCtrl.handleNewUser)