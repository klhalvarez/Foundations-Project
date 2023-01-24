//Contains ticket-related functions handling creation and approval of reimbursement tickets:

const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();
let randomNumber = (Math.floor(Math.random()*1000));
//Gives a random whole number

//Function to add reimbursement ticket to database for review:
function newTicket($amount, description, username) {
    return docClient.put({
        TableName: "Tickets",
        Item: {
            "ticket_id": randomNumber,
            "$amount": $amount,
            "description": description,
            "username": username,
            "status": "pending"
        }
    }).promise();
}

//Testing newTicket function: WORKS!
// newTicket(545.89, 'week1 car rental', 'parkjimin').then(data => {
//     console.log(data);
//     console.log("New ticket added successfully");
// }).catch(err => {
//     console.error(err);
// });

module.exports = {
    newTicket
};