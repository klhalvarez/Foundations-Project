const server = require('./Foundations-Project/server');
const AWS = require('aws-sdk');
const uuid = require ('uuid');

AWS.config.update({
    region: 'us-east-1'
});

const documentClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: 'Users',
    Item: {
        user_name: 'testie',
        password: 'test123',
        role: 'employee'
    }
};

documentClient.put(params, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Successfully added user");
    }
});

//TEST

// function retrieveUserName(username) {
//     const params = {
//         TableName: 'Users',
//         Key: {
//             username
//         }
//     };

//     return documentClient.get(params).promise();
// }


// server.post('/login', async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     const data = await retrieveUserName(username);
//     const userItem = data.Item;

// //To see if user with given username exists:
//     if (userItem) {
//         if (userItem.password === password) {
//             //Successful login! Create JWT:
//             // const token = createJWT(userItem.username, userItem.role);

//             res.send({
//                 "message": "Successfully logged in",
//                 "token": token
//             });
//         } else {
//             res.statusCode = 400;
//             res.send({
//                 "message": "Incorrect password."
//             })
//         }
//     } else {
//         res.statusCode = 400;
//         res.send({
//             "message": `User with username ${username} does not exist`
//         })
//     }
// });
















