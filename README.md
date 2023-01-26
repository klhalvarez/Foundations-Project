
## Expense Reimbursement Project Documentation

## Startup

To start the application:

1. Run 'npm install' to install all necessary node packages
2. Run 'node index.js' in the terminal to start the server. The server is configured to run on PORT 3000.

Endpoints
Login Endpoint
Request

HTTP Method
POST
URL
/login
Headers
Content-Type: application/json
Body
{
    "username": "user123",
    "password": "password123"
}
Response Scenarios

Valid username and password provided in request body
Status Code
200 OK
Body
{
    "message": "Sucessful login!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtcGxveWVlMTIzIiwicm9sZSI6ImVtcGxveWVlIiwiaWF0IjoxNjc0NTAzMjIxfQ.ZO1lCKDwyupbugoMzC5u8WymmuwtDTaleecz3DbcaoQ"
}
Headers
Content-Type: application/json
Invalid username
Status Code
400 Bad Request
Body
{
    "message": "Username is invalid"
}
Headers
Content-Type: application/json
Invalid password, valid username
Status Code
400 Bad Request
Body
{
    "message": "Invalid password!"
}
Headers
Content-Type: application/json
Registration Endpoint
Request

HTTP Method
POST
URL
/users
Headers
Content-Type: application/json
Body
{
    "username": "newuser123",
    "password": "password123",
}
Response Scenarios

Successful registration
Status Code
201 Created
Body
{
    "message": "User successfully registered"
}
Headers
Content-Type: application/json
Unsuccessful registration because username is already taken
Status Code
400 Bad Request
Body
{
    "message": "Username already taken"
}
Headers
Content-Type: application/json
Username is blank
Password provided is blank
Password must have numbers, letters, and a special character
...
Add Reimbursement Endpoint
Request

HTTP Method
POST
URL
/reimbursements
Body
{
    "amount": 15.75,
    "description": "This is a description"
}
Headers
Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRvbm5hMTUiLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE2NzQ1MDUzNjd9.klfpyS-N8q3lzFkAkM4lQGGuKF3yE7c6Fa5Z_Ac4spY"
We need to include the JWT as part of the Authorization header so that we can authorize access to add a reimbursement
Content-Type: application/json
Response Scenarios

Successfully added reimbursement
Status Code
201 Created
Body
{
    "message": "Successfully added reimbursement"
}
Headers
Content-Type: application/json
Token where role does not equal employee
Status Code
401 Unauthorized
Body
{
    "message": "You do not have the appropriate role of 'employee' to access this operation"
}
Headers
Content-Type: application/json
Authorization header is not provided
Status Code
400 Bad Request
Body
{
    "message": "No Authorization header provided"
}
Headers
Content-Type: application/json
JWT is invalid
Status Code
400 Bad Request
Body
{
    "message": "Invalid JWT"
}
Headers
Content-Type: application/json