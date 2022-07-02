const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { username, pwd } = req.body
    if (!username || !pwd) return res.status(400).json({ 'message': 'Username and password are required' })

    // Check Dublicate usernames

    duplicate = usersDB.users.find(person => person.username === username)
    if (duplicate) return res.sendStatus(409)

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10)
        //store new user
        const newUser = { "username": username, "password": hashedPwd }

        usersDB.setUsers([...usersDB.users, newUser])

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        console.log(usersDB.users)
        res.status(201).json({ 'success': `New user ${username} created`})
        

    } catch (error) {
        res.status(500).json({ 'message': error.message })
    }
}

module.exports = { handleNewUser }