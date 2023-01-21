//Creating server:

const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;

const server = express();

server.use(bodyParser.json());

//test endpoint
server.get('/employee', (req, res) =>{
    res.status(200).send("You have reached the employee login page.")
});
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = server;

//Simple server working!