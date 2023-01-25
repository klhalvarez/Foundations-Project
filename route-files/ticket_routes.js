//Handles HTTP endpoints ticket-related requests:

const express = require('express');
const router = express.Router();

const jwt = require('../utility/jwts');

const ticketDao = require('../dao-files/ticket_dao');


//Endpoint for submitting a new ticket into the system:
router.post('/tickets/submit', async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
//Gets the token from the authorization header to check for role:manager
        const token = authorizationHeader.split(" ")[1];
        const tokenPayload = await jwt.verifyToken(token);

        if (tokenPayload.role === 'employee') {
            await ticketDao.newTicket(req.body.$amount, req.body.description, tokenPayload.username);
            res.send({
                "message": "New ticket successfully added to system."
            })
        } else {
            res.statusCode = 401;
            res.send({
                "message": "You are not authorized for this action. Please log in to your employee account to process a reimbursement ticket."
            })
        };
        } catch(err) {
            if (err.name === 'JsonWebTokenError') {
                res.statusCode = 400;
                res.send({
                    "message": "Invalid JsonWebToken."
            })
        } else if (err.name === 'TypeError') {
            res.statusCode = 400;
            res.send({
                "message": "No Authorization header provided."
            });
        } else {
            res.statusCode = 500;
            //server error
            res.send({
                "message": "Something went wrong. Please reload the page and try again. :/"
            });
        }
    }
    
});

//Endpoint for manager to view tickets with 'pending' status:
router.get('/tickets/status', async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
//Gets the token from the authorization header to check for role:manager
        const token = authorizationHeader.split(" ")[1];
        const tokenPayload = await jwt.verifyToken(token);

        if (tokenPayload.role === 'manager') {
            await ticketDao.retrieveTicketsByStatus(req.query.status);
            res.send({
                "message": "Returned all tickets with 'pending' status."
            })
        } else {
            res.statusCode = 401;
            res.send({
                "message": "You are not authorized for this action. If you are a manager, please log into your manager account to make changes to tickets."
            })
        }}  catch(err) {
                if (err.name === 'JsonWebTokenError') {
                    res.statusCode = 400;
                    res.send({
                        "message": "Invalid JsonWebToken."
            })}  else if (err.name === 'TypeError') {
                    res.statusCode = 400;
                    res.send({
                    "message": "No Authorization header provided."
            });
            }   else {
                res.statusCode = 500;
                //server error
                res.send({
                    "message": "Something went wrong. Please reload the page and try again. :/"
            });
        }
    }
    
});



module.exports = router;