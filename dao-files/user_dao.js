//Contains user-related functions handling user login and registration:
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

//Function to retrieve Username from DB
function retrieveUserName(username) {
    return docClient.get({
        TableName: 'Users',
        Key: {
            "username": username
        }
    }).promise();
}


//Testing 'retrieveUserName' function: WORKS!
// retrieveUserName('parkjimin').then(data => {
//     console.log(data.Item);
// })


//Function to register a new user account:
function registerNewUser(username, password) {
    return docClient.put({
        TableName: "Users",
        Item: {
            "username": username,
            "password": password,
            "role": "employee"
        }
    }).promise();
}

//Testing 'registerNewUser' function: WORKS!
// registerNewUser('kimnamjoon', 'wildflower39').then(data => {
//     console.log(data);
//     console.log("Registration successful!");
// }).catch(err => {
//     console.error(err);
// });










module.exports = {
    retrieveUserName, registerNewUser
}

