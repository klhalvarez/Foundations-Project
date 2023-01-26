//Handles HTTP endpoints ticket-related requests:

const express = require('express');
const router = express.Router();

const jwt = require('../utility/jwts');

const ticketDao = require('../dao-files/ticket_dao');


//Endpoint for employees to submit new tickets into the system:
router.post('/tickets/employee/submit', async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
//Gets the token from the authorization header to check for role:manager
        const token = authorizationHeader.split(" ")[1];
        const tokenPayload = await jwt.verifyToken(token);

        if (tokenPayload.role === 'employee') {
            const amount = req.body.$amount;
            const description = req.body.description;
            if (amount === " " || description === " ") {
                res.send({
                    "message": "Your ticket MUST have an amount and description to be entered into the system. Please try again."
                })
            } else {
                await ticketDao.newTicket(req.body.$amount, req.body.description, tokenPayload.username);
                res.send({
                    "message": "New ticket successfully added to system."
                })
            }
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


//Endpoint for managers to view tickets with 'pending' status:
router.get('/tickets/manager/status', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const tokenPayload = await jwt.verifyToken(token);

        if (tokenPayload.role === 'manager') {
            let pendingTickets = await ticketDao.retrieveTicketsByStatus("pending");
//Creates queue for pending tickets to be added to. As they are worked on and the website is refreshed, the tickets are removed from the queue.
            const pendingTicketsQueue = [];
            pendingTicketsQueue.push(pendingTickets);
            if (pendingTickets.Items.length > 0) {
                    res.send(pendingTicketsQueue);
                    res.send({
                        "message": "Returned all tickets with 'pending' status."
                    })
            } else {
                res.send('There are no pending tickets to be viewed now.')
            }
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


//Endpoint for manager to approve or deny pending tickets:
router.post('/tickets/manager/process', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const tokenPayload = await jwt.verifyToken(token);

        const ticket_id = req.body.ticket_id;
        const updatedStatus = req.body.updatedStatus;

        const data = await ticketDao.retrieveTicketByTicketID(ticket_id);
        const ticketItem = data.Item;

        if (tokenPayload.role === 'manager') {
            if (ticketItem) {
                if (ticketItem.status === 'pending') {
                    if (updatedStatus === "approved" || updatedStatus === "denied") {
                        ticketDao.updateTicketStatusByTicketID(req.body.ticket_id, req.body.updatedStatus);
                        res.send({
                            "message": "Ticket updated successfully!"
                        })
                    } else {
                        res.send({
                            "message": "Ticket status may only be updated to 'approved' or 'denied'."
                        })
                    }
                } else {
                    res.send({
                        "message": "Error: A ticket must be in 'pending' status to be processed as either 'approved' or 'denied'."
                    })
                }
            } else {
                res.send({
                    "message": "This ticket ID is not in 'pending' status. Please check ticket ID and try again."
                })
            }
        } else {
            res.send({
                "message": "You are not authorized for this action. If you are a manager, please log into your manager account to make changes to tickets."
            })
        }
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


//Endpoint for employees to view their tickets:
router.get('/tickets/employee/view', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const tokenPayload = await jwt.verifyToken(token);

        if (tokenPayload.role === 'employee') {
            let viewingTickets = await ticketDao.retrieveTicketsByUsername(req.body.username);
            const username = req.body.username;
//Creates queue for employee tickets to be added to so they can be viewed
            const viewingTicketsQueue = [];
            viewingTicketsQueue.push(viewingTickets);
            if (viewingTickets.Items.length > 0) {
                    res.send(viewingTicketsQueue);
            } else {
                res.send({
                    "message": `${username} has no tickets in this system.`
                })
            }
        } else {
            res.statusCode = 401;
            res.send({
                "message": "You are not authorized for this action. If you are a manager, please log into your manager account to make changes to employee reimbursement tickets."
            })
        }
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



module.exports = router;