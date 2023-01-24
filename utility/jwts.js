//Need to install jsonwebtoken and import it
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
//Bluebird gives the ability to use '.promisify' and turn callback functions into promise-based functions

//Function to create a new JWT token with the username and role information included:
function newToken(username, role) { 
    return jwt.sign({
        "username": username,
        "role": role
    }, 'thissecretsignsthetoken', {
        expiresIn: '1d'
    });
}

//Testing the newToken function: WORKS!
// const token = newToken('user123', 'manager');
// console.log(token);

//Function to return a promise that contains the payload when the promise is resolved:
function verifyTokenAndReturnPayload(token) {
    jwt.verify = Promise.promisify(jwt.verify); 
    return jwt.verify(token, 'thissecretsignsthetoken'); 
}

//Test for verifyTokenAndReturnPayload function: WORKS!
// verifyTokenAndReturnPayload(newToken('user123', 'admin')).then((payload) => {
//     console.log(payload);
// }).catch((err) => {
//     console.error(err);
// });



module.exports = {
    newToken,
    verifyTokenAndReturnPayload
}