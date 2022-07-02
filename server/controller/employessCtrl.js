const express = require('express')
const app = express()
const usersDB = {
    users: require('../model/employees.json'),
    setUsers: function (data) { this.users = data }
}

const employees = (req, res) => {
    res.json(usersDB.users)
}

module.exports = employees

