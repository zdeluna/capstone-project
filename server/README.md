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

### Access development project on Google Cloud

API endpoint can be reached at https://capstone-wazn.appspot.com/api/

# API Documentation

### Authorization

On protected routes, the user agent should sent the JWT in the Authorization header using the Bearer schema.  
Authorization: Bearer `<token>`

## Sign up a new user using email and password

### POST /signup

#### Body parameters:

username - The email address of the user  
password - The password of the user

Response: 200 OK

Example:

```
{
    "msg": "Signup was sucessful",
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

username - The email address of the user  
password - The password of the user

Response: 200 OK { token: token}

Example:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVjNGRlNjcwZTE5MTI3MWVlYmM4MjRlNCJ9LCJpYXQiOjE1NDg2MDk0NjB9.9Y3UHTC-DpoofVyVqw3devTR6BzCD9GNqwaml2LCqOQ"
}
```

## Login using Google Oauth2

## POST login/google

---

## Delete a authenticated user using user id

### DELETE /users/:id

#### Parameters:

id - The id of the authenticated user

Response 204 No Content

## Get a user using user id

### GET /users/:id

#### Parameters:

id - The id of the authenticated user

Response 200 OK

Example: (Subject to change, will be much longer once we develop records, exercise, etc

```
{
    "_id": "5c4f80dd0e00530787aeb957",
    "username": "user1@gmail.com",
    "password": "$2b$10$xrsA7AZDZ34OxGCAkHCZVOON9xpxsNc/ptrlzVzouZSjeTiL2kuJC",
    "__v": 0
}
```

## Update an authenticated user using user id

### PATCH /users/:id

#### Parameters:

id - The id of the authenticated user

Body Parameters - All optional

first_name - The first name of the user
last_name - The last name of the user
location - The city, state where the user resides
date_of_birth - DOB of user - Formatted as “MM/DD/YYYY”

Response 200 OK
