## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to download the .env and place it in /server

### Installing

Install the dependencies of the server

```
cd server && npm install
```

To run the server on port 5001

```
nodemon server.js
```

# API Documentation

## Sign up a new user using email and password

###POST /signup

Body parameters:
email - The email address of the user
password - The password of the user
Response: 200 OK

## Login in a user using email and password

###POST /login

Body parameters:
email - The email address of the user
password - The password of the user

Response: 200 OK { token: token}
