//Contains opening dependencies and PORT information:

const express = require('express');
const bodyParser = require('body-parser');

//Router imports
const userRouter = require('./route-files/user_routes');
const ticketRouter = require('./route-files/ticket_routes');


const PORT = 3000;
const server = express();

server.use(bodyParser.json());
server.use(userRouter);
server.use(ticketRouter);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
}); 











