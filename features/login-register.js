const AWS = require('aws-sdk');
const uuid = require ('uuid');
const prompt = require('prompt-sync');

AWS.config.update({
    region: 'us-east-1'
});

const DbClient = new AWS.DynamoDB.DocumentClient();

//Register a new user:
function registerNewUser(user_name, password, role) {
    const params = {
        TableName: 'Users',
        User: {
            user_name : prompt("Please enter your desired user name"),
            password : prompt("Please enter a password for your new account."),
            role : "employee"
        }
    }

    return DbClient.put(params).promise();
}

registerNewUser(user_name, password, role).then((data) => {
    console.log('New account successfully registered!');
}).catch((err) => {
    console.timeLog('An error occurred!');
    console.log(err);
});





// const params = {
//     TableName: 'Users',
//     Item: {
//         user_name: 'testie',
//         password: 'test123',
//         role: 'employee'
//     }
// };

// DbClient.put(params, (err) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("Successfully added user");
//     }
// });
// Adding new user works!

// async function retrieveUserName(user_name) {
//     const params = {
//         TableName: 'Users',
//         Key: {
//             user_name
//         }
//     };

   
// }


  // let data = await DbClient.get(params).promise().then();
    // return data;

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