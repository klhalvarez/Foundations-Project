//Contains ticket-related functions handling creation and approval of reimbursement tickets:

const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

let randomNumber = (Math.floor(Math.random()*1000));
//Gives a random whole number. Used here for numbering newly created tickets


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

// Testing newTicket function: WORKS!
// newTicket(545.89, 'week1 car rental', 'parkjimin').then(data => {
//     console.log(data);
//     console.log("New ticket added successfully");
// }).catch(err => {
//     console.error(err);
// });


//Function to retrieve all tickets by status:
function retrieveTicketsByStatus(status) {
    return docClient.query({
        TableName: "Tickets",
        IndexName: "status-index",
        KeyConditionExpression: "#b = :value",
        ExpressionAttributeNames: {
            "#b": "status"
        },
        ExpressionAttributeValues: {
            ":value": status
        }
    }).promise();
}

//Testing retrieveTicketsByStatus function: WORKS!
// retrieveTicketsByStatus('pending').then(data => {
//     const pendingTicketsQueue = [];
//     pendingTicketsQueue.push(data);
//     console.log(pendingTicketsQueue);
//     console.log("Tickets gathered successfully");
// }).catch(err => {
//     console.error(err);
// });


//Function to retrieve tickets by ticketID (so managers can process):
function retrieveTicketByTicketID(ticket_id) {
    const params = {
        TableName: "Tickets",
        Key: {
            "ticket_id": ticket_id
        }
    }
    return docClient.get(params).promise();
}

//Testing retrieveTicketByTicketID function: WORKS!
// retrieveTicketByTicketID(502).then(data => {
//     console.log(data);
//     console.log("Ticket gathered successfully");
// }).catch(err => {
//     console.error(err);
// });


function updateTicketStatusByTicketID(ticket_id, updatedStatus) {
    return docClient.update({
        TableName: "Tickets",
        Key: {
            "ticket_id": ticket_id
        },
        UpdateExpression: 'set #t = :value',
        ExpressionAttributeNames: {
            '#t': 'status'
        },
        ExpressionAttributeValues: {
            ':value': updatedStatus
        }
    }).promise();
};

//Testing updateTicketStatusByTicketID function: WORKS!
// updateTicketStatusByTicketID(502, 'approved').then(data => {
//     console.log(data)
//     console.log("Ticket updated successfully");
// }).catch(err => {
//     console.error(err);
// });


//Function for employees to retrieve their tickets by their username
function retrieveTicketsByUsername(username) {
    return docClient.query({
        TableName: "Tickets",
        IndexName: "username-index",
        KeyConditionExpression: "#s = :value",
        ExpressionAttributeNames: {
            "#s": "username"
        },
        ExpressionAttributeValues: {
            ":value": username
        }
    }).promise();
}

//Testing retrieveTicketsByUsername function: WORKS!
// retrieveTicketsByUsername('parkjimin').then(data => {
//     const employeeTicketsQueue = [];
//     employeeTicketsQueue.push(data);
//     console.log(employeeTicketsQueue);
//     console.log("Tickets gathered successfully");
// }).catch(err => {
//     console.error(err);
// });
    


module.exports = {
    newTicket,
    retrieveTicketsByStatus,
    retrieveTicketByTicketID,
    updateTicketStatusByTicketID,
    retrieveTicketsByUsername
};