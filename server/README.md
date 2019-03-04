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

API endpoint can be reached at https://capstone-wazn.appspot.com/api

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

## Get all user entities

### GET /users

#### Parameters: None

## Get a user using user id

### GET /users/:id

#### Parameters:

id - The id of the authenticated user

Response 200 OK

Example: (Subject to change, will be much longer once we develop records, exercise, etc

```
{
    "friends": ["5be8d38a9d57d3088a747d8f"],
    "pending_friends": [
        {
            "user": "5c58d43a9de2d3088a747c9c",
            "status": 1
        }
    ],
    "_id": "5c58d4379de2d3088a747c9b",
    "username": "user1@gmail.com",
    "password": "$2b$10$tFqOv3glwOlp4QB3pZJNOOVdGQSEpWmERQ8gVKUA0roFS7LhtJzM6",
    "__v": 0,
    "date_of_birth": "1987-04-05T06:00:00.000Z",
    "first_name": "Zachary",
    "last_name": "DeLuna"
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

## Send/Accept/Reject a friend request

### PATCH /users/:userID/friends/:friendID

userID - The id of the user  
friendID = the id of the person the user wants to send a friend request

#### Body Parameters - Required

status - The status code which indicates the stage of the friendship  
0 - Send a friend request  
3 - Accept a friend request  
4 - Reject a friend request

Other codes that are only seen in /users/:id GET requests  
1 - A friend request has been sent to another user  
2 - A friend request has been received from another user

## Delete an authenticated user using user id

### DELETE /users/:id

#### Parameters:

id - The id of the authenticated user

Response 204 No Content

---

## Get a challenge

### GET /challenges/:id

#### Parameters:

id - The id of the challenge

Response 200 OK

Example:

```
{
    "pending_participants": [],
    "_id": "5c697086cc4db848f636433a",
    "name": "Work Challenge",
    "start_date": "2019-02-17T05:00:00.000Z",
    "activity": "WALK",
    "measurement": "KM",
    "duration": "2",
    "participants": [
        {
            "_id": "5c697086cc4db848f636433b",
            "user_id": "5c69704bcc4db848f6364338",
            "total": 0
        },
        {
            "_id": "5c69708fcc4db848f636433c",
            "user_id": "5c69704ecc4db848f6364339",
            "total": 0
        }
    ],
    "messages": [
        {
            "_id": "5c697098cc4db848f636433d",
            "content": "I am going to win",
            "sender": "5c69704bcc4db848f6364338"
        }
    ],
    "__v": 0
}
```

## Post a new challenge

### POST /challenges/

#### Body Parameters:

name - The name of the challenge

start_date - The start date of the challenge MM-DD-YYYY

activity - The type of activity

measurement - The unit of measurement to measure activity

duration - The number of days of the challenge

## Invite a participant to the challenge

### POST /challenges/:challengeID/participants/:participantID

#### Parameters:

challengeID - The id of the challenge

participantID - The user id of the invited user

## Write a message on the message board of the challenge

### POST /challenges/:id/messages

#### Parameters:

id - The id of the challenge

#### Body Parameters

content - The content of the message

reply \*optional - The id of the message the user is replying to

Requires a valid token of a user that is a participant of the challenge

## Update a challenge

### POST /challenges/:id

#### Parameters:

id - The id of the challenge

#### Body Parameters: All optional

name - The name of the challenge

start_date - The start date of the challenge MM-DD-YYYY

activity - The type of activity

measurement - The unit of measurement to measure activity

duration - The number of days of the challenge

## Delete a challenge

### DELETE /challenges/:id

#### Parameters:

id - The id of the challenge

Response: 204 No Content

---

## Create a new conversation

### POST /conversations/

#### Body Parameters:

recipient - The id of the recipent

content - message content

## Get a conversation

### GET /conversations/:id

#### Parameters:

id - The id of the conversation

Response: 200 OK

Example:

```
{
    "messages": [
        {
            "_id": "5c75aa392d946207839fc980",
            "sender": "5c75aa022d946207839fc97d",
            "content": "Hi, how are you",
            "createdAt": "2019-02-26T21:06:01.273Z",
            "updatedAt": "2019-02-26T21:06:01.273Z"
        },
        {
            "_id": "5c75aa3e2d946207839fc982",
            "sender": "5c75aa0a2d946207839fc97e",
            "content": "I am doing well, how are you user 3",
            "createdAt": "2019-02-26T21:06:06.854Z",
            "updatedAt": "2019-02-26T21:06:06.854Z"
        }
    ],
    "participants": [
        "5c75aa022d946207839fc97d",
        "5c75aa0a2d946207839fc97e",
        "5c75646c75fd4b046dc77b31",
        "5c75aa0d2d946207839fc97f"
    ],
    "_id": "5c75aa392d946207839fc981",
    "__v": 0
}
```

## Delete a message

### DELETE /conversations/:conversationID/messages/:messageID

#### Parameters

conversationID - The id of the conversation

messageID - The id of the message

## Update a message

### PATCH /conversations/:conversationID/messages/:messageID

#### Parameters

conversationID - The id of the conversation

messageID - The id of the message

Response: 200 OK

#### Body Parameters

content - The updated message

## Leave a conversation

### DELETE /conversations/:conversationID/participants

conversationID - The id of the conversation

Response: 200 OK

## Delete a message

### DELETE /conversations/:conversationID/messages/:messageID

#### Parameters

conversationID - The id of the conversation  
messageID = The id of the message

Response: 200 OK

---

## Post a new activity

### POST /activities/

#### Body Parameters:

description \*optional - A description of the activity

type - The type of activity i.e. BiKING, RUNNING

date - The date of the activity

measurement - The unit of measurement to measure activity such as steps or time

units - The units the activity is measured in

value: The amount of activity

Response: 200 OK

## Update an activity

### PATCH /activities/:id

#### Parameters

id - The id of the activity you wish to update

#### Body Parameters:

description - A description of the activity

type - The type of activity i.e. BiKING, RUNNING

date - The date of the activity

measurement - The unit of measurement to measure activity such as steps or time

units - The units the activity is measured in

value: The amount of activity

Reponse: 200 OK

## Get an activity

### GET /activities/:id

#### Parameters

id - The id of the activity you wish to update

Response: 200 OK

Example:

```
{
    "_id": "5c7ac9654890ce1d5fe1c690",
    "description": "Running around the lake",
    "type": "RUNNING",
    "date": "2019-03-01T06:00:00.000Z",
    "measurement": "DISTANCE",
    "units": "kilometers",
    "value": "10",
    "user_id": "5c7ac9324890ce1d5fe1c68f",
    "__v": 0
}
```

## Get all activities

### GET /activities/

Response: 200 OK

## Make a query of activities

### GET /activities/?user_id={{userID}}&type={{type}}&start_date={start_date}&end_date={end_date}

#### Query Parameters

user_id - The user id of the actitivies

type - The type of activity i.e. BiKING, RUNNING

start_date - the beginning date in YYYY-MM-DD

end_date - the end date in YYYY-MM-DD

start_date and end_date are inclusive, all activities between those two dates will be returned

Response: 200 OK
