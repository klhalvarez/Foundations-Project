//Handles HTTP ticket-related requests:

const express = require('express');
const router = express.Router();

const jwts = require('../utility/jwts');

const ticketDao = require('../dao-files/ticket_dao');

router.post('/tickets/submit', async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(" ")[1];
        const tokenPayload = await jwts.verifyTokenAndReturnPayload(token);

        if (tokenPayload.role === 'employee') {
            await ticketDao.newTicket(tokenPayload.username, req.body.amount, req.body.description);
        
            res.statusCode = 201;
            res.send({
                "message": "New ticket successfully added to system."
            })
        } else {
            res.statusCode = 401;
            res.send({
                "message": "You are not authorized for this action. Please log in to your employee account to process a reimbursement ticket."
            })
        }
    } catch(err) {
        if (err.name === 'JsonWebTokenError') {
            res.statusCode = 400;
            res.send({
                "message": "Invalid JWT"
            })
        } else if (err.name === 'TypeError') {
            res.statusCode = 400;
            res.send({
                "message": "No Authorization header provided"
            });
        } else {
            res.statusCode = 500; // 500 internal server error
        }
    }
    
});