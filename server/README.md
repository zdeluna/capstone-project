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

---

# API Documentation

## Sign up a new user using email and password

### POST /signup

#### Body parameters:

username - The email address of the user\
password - The password of the user\

Response: 200 OK

Example:/

```
{
    "message": "Signup was sucessful",
    "user": {
        "_id": "5c4de670e191271eebc824e4",
        "username": "user1@gmail.com",
        "password": "$2b$10$4x1ovXtsEM7xPsLQgEc81OJELqq1xOxFyIILg37omPagUfIg9BjqC",
        "__v": 0
    }
}
```

## Login in a user using email and password

### POST /login

#### Body parameters:

username - The email address of the user\
password - The password of the user\

Response: 200 OK { token: token}

Example:/

---
