//Handles HTTP endpoints for user-related requests:

const express = require('express');
const router = express.Router();
const jwt = require('../utility/jwts');

const userDao = require('../dao-files/user_dao');

//Welcome message to test server is working on Postman: 
router.get('/', (req, res) => {
    res.send("Welcome to the home page.");
});


//Endpoint for employees to log in: 
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const data = await userDao.retrieveUserName(username);
    const userItem = data.Item;

    if (userItem) {
        if (userItem.password === password) {
            res.send({
                "message": "You have successfully logged in.",
                "token": jwt.newToken(userItem.username, userItem.role)
//To get 'payload' for token
            });
        } else {
            res.statusCode = 400;
            res.send({
                "message": "Incorrect password. Please try again."
            });
        }
    } else { 
        res.statusCode = 400;
        res.send({
            "message": "This username does not exist. Please register a new account."
        })
    }
});


//Endpoint for employees to register a new account:
router.post('/employee/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

//Check if user with username already exists
    const data = await userDao.retrieveUserName(username);
    if (data.Item) { 
        res.statusCode = 400;
        res.send({
            "message": "This username is already in use. Please choose a different username and try again."
        })
    } else {
        await userDao.registerNewUser(username, password);
        res.send({
            "message": "New account created successfully. Please log in with your new credentials to continue."
        })
    }
    });
    

module.exports = router;