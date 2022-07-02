const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')
require('dotenv').config()

const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

const handeLogin = async (req, res) => {
    const { username, pwd } = req.body
    if(!username || !pwd ) return res.status(400).json({'message': 'username or password are required'})

    const foundUser = usersDB.users.find(person => person.username === username)
    if(!foundUser) return res.sendStatus(401)

    const matchPwd = await bcrypt.compare(pwd, foundUser.password)
    if(matchPwd){
        // create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        )

        const refreshToken = jwt.sign(
            {"username" : foundUser.username } ,
            REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )
        // Saving refreshToken with current user

        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = {...foundUser, refreshToken }
        usersDB.setUsers([...otherUsers, currentUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken })
    }else {
        res.sendStatus(401)
    }

}

module.exports = { handeLogin }