const jwt = require('jsonwebtoken')
require('dotenv').config()

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

const refreshToken = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(400)
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt
    
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser) return res.sendStatus(403) // forbidden

    jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || !foundUser.username !== decoded.username) return res.sendStatus(403)
            const accessToken = jwt.sign(
                { "username": decoded.username },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '30s'}
            )
            res.json({ accessToken })
        }
    )   
}

module.exports = { refreshToken }