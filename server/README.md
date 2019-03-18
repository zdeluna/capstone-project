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

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `username` | `string` | The email address of the user |
| `password` | `string` | The password of the user      |

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

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `username` | `string` | The email address of the user |
| `password` | `string` | The password of the user      |

Response: 200 OK

Example Response:

```
{
    "token": "eyJhbGciOiJIUzI1KiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVjODNlMjQ4ZDlhOTliMWU3NjlkZGMwMyJ9LCJpYXQiOjE1NTIxNDcwMjR9.Vflm1hxHHrZ-LROwWK27S5yA14DM44dL1U3gpIFC95Q",
    "user_id": "5c83e248d9a99b1e769ddc03"
}
```

---

## Get all user entities

### GET /users

#### Parameters: None

## Get a user using user id

### GET /users/:id

#### Parameters:

| Parameter | Description        |
| --------- | ------------------ |
| `id`      | The id of the user |

Response 200 OK

Example:

```
{
    "friends": ["5c852ade63f7cc25ba67a5d8", "5c872ade63f7cc25ba67a5f6"],
    "pending_friends": [
        {
            "user": "5c852ade63f7cc25ba67a5f6",
            "status": 1
        }
    ],
    "challenges": [
        "5c882caeb76d723998384423"
    ],
    "conversations": [
        "5c882d02b76d723998384426"
    ],
    "pending_challenges": [],
    "records": [
        "5c88274b71d95438e5f6e5c3"
    ],
    "_id": "5c88270a71d95438e5f6e5c0",
    "username": "user1ZachTEST@gmail.com",
    "password": "$2b$10$oa6AjgBXAO1o1sGwM9w9..r2A4ZpHu7Bnzcsl6jrJLJnTSLRDB7cO",
    "__v": 0
}
```

## Update a user

### PATCH /users/:id

#### Authorization: `token required`

#### Parameters:

| Parameter | Description        |
| --------- | ------------------ |
| `id`      | The id of the user |

#### Body Parameters

| Parameter       | Type     | Description                             |
| --------------- | -------- | --------------------------------------- |
| `first_name`    | `string` | The first name of the user              |
| `last_name`     | `string` | The last name of the user               |
| `location`      | `string` | The city, state where the user resides  |
| `date_of_birth` | `string` | DOB of user - Formatted as `MM/DD/YYYY` |

Response: 200 OK

## Send/Accept/Reject a friend request

### PATCH /users/:userID/friends/:friendID

#### Authorization: `token required`

#### Parameters:

| Parameter  | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| `userID`   | The id of the user                                           |
| `friendID` | The id of the person the user wants to send a friend request |

#### Body Parameters

| Parameter | Type     | Description                                                 |
| --------- | -------- | ----------------------------------------------------------- |
| `status`  | `string` | The status code which indicates the stage of the friendship |

status - The status code which indicates the stage of the friendship  
0 - Send a friend request  
3 - Accept a friend request  
4 - Reject a friend request

Other codes that are only seen in /users/:id GET requests  
1 - A friend request has been sent to another user  
2 - A friend request has been received from another user

## Delete an authenticated user using user id

### DELETE /users/:id

#### Authorization: `token required`

#### Parameters:

| Parameter | Description                      |
| --------- | -------------------------------- |
| `id`      | The id of the authenticated user |

Response 204 No Content

---

## Get a challenge

### GET /challenges/:id

#### Parameters:

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | The id of the challenge |

Response 200 OK

Example:

```
{
    "pending_participants": [],
    "messages": [
        {
            "_id": "5c7db17cf776bf3188323755",
            "sender": "5c7db158f776bf3188323751",
            "content": "How are you user 2?",
            "replies": [
                "5c7db183f776bf3188323756"
            ],
            "createdAt": "2019-03-04T23:15:08.927Z",
            "updatedAt": "2019-03-04T23:15:15.262Z"
        },
        {
            "_id": "5c7db183f776bf3188323756",
            "sender": "5c7db01f5ab8f33131af14f0",
            "content": "Hi, from user 2",
            "replies": [],
            "reply_to": "5c7db17cf776bf3188323755",
            "createdAt": "2019-03-04T23:15:15.145Z",
            "updatedAt": "2019-03-04T23:15:15.145Z"
        }
    ],
    "_id": "5c7db16ff776bf3188323752",
    "name": "Work Challenge",
    "start_date": "2019-02-17T06:00:00.000Z",
    "activity": "WALK",
    "measurement": "KM",
    "duration": "2",
    "participants": [
            "5c7db158f776bf3188323751",
			5c7db01f5ab8f33131af14f0"
    ]
          ],
    "__v": 0
}
```

## Post a new challenge

### POST /challenges

#### Authorization: `token required`

#### Body Parameters:

| Parameter     | Type     | Description                                  |
| ------------- | -------- | -------------------------------------------- |
| `name`        | `string` | The name of the challenge                    |
| `start_date`  | `string` | The start date of the challenge `MM-DD-YYYY` |
| `activity`    | `string` | The type of activity                         |
| `measurement` | `string` | The unit of measurement to measure activity  |
| `duration`    | `string` | The number of days of the challenge          |

## Update a challenge

### POST /challenges/:id

#### Parameters:

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | The id of the challenge |

#### Body Parameters:

| Parameter     | Type     | Description                                  |
| ------------- | -------- | -------------------------------------------- |
| `name`        | `string` | The name of the challenge                    |
| `start_date`  | `string` | The start date of the challenge `MM-DD-YYYY` |
| `activity`    | `string` | The type of activity                         |
| `measurement` | `string` | The unit of measurement to measure activity  |
| `duration`    | `string` | The number of days of the challenge          |

## Delete a challenge

### DELETE /challenges/:id

#### Authorization: `token required`

#### Parameters:

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | The id of the challenge |

Response: 204 No Content

## Invite a participant to the challenge

### POST /challenges/:challengeID/participants/:participantID

#### Authorization: `token required`

#### Parameters:

| Parameter       | Description               |
| --------------- | ------------------------- |
| `challengeID`   | The id of the challenge   |
| `participantID` | The id of the participant |

#### Body Parameters:

| Parameter | Type     | Description                                                                       |
| --------- | -------- | --------------------------------------------------------------------------------- |
| `status`  | `string` | Indicates the stage of where the user is in the accepting/rejecting the challenge |

0 - Send challenge request  
1 - Pending challenge request  
2 - Accept challenge request  
3 - Reject challenge request

## Remove a participant from a challenge

### DELETE /challenges/:challengeID/participants/:participantID

#### Authorization: `token required`

#### Parameters:

| Parameter       | Description               |
| --------------- | ------------------------- |
| `challengeID`   | The id of the challenge   |
| `participantID` | The id of the participant |

## Write a message on the message board of a challenge

### POST /challenges/:id/messages

#### Authorization: `token required`

#### Parameters:

| Parameter | Description             |
| --------- | ----------------------- |
| `id`      | The id of the challenge |

#### Body Parameters:

| Parameter | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `content` | `string` | The content of the message                    |
| `reply`   | `string` | The id of the message the user is replying to |

Response: 200 OK

## Update a message on the message board of a challenge

### PATCH /challenges/:challengeID/messages/:messageID

#### Authorization: `token required`

#### Parameters:

| Parameter       | Description               |
| --------------- | ------------------------- |
| `challengeID`   | The id of the challenge   |
| `participantID` | The id of the participant |

#### Body Parameters:

| Parameter | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `content` | `string` | The content of the message                    |
| `reply`   | `string` | The id of the message the user is replying to |

## Delete a message on the mesage board of a challenge

### DELETE /challenges/:challengeID/messages/:messageID

#### Authorization: `token required`

#### Parameters:

| Parameter     | Description             |
| ------------- | ----------------------- |
| `challengeID` | The id of the challenge |
| `messageID`   | The id of the message   |

Response: 204 No Content

---

## Create a new conversation

### POST /conversations

#### Authorization: `token required`

#### Body Parameters:

| Parameter   | Type     | Description             |
| ----------- | -------- | ----------------------- |
| `recipient` | `string` | The id of the recipient |
| `content`   | `string` | The message content     |

## Get a conversation

### GET /conversations/:id

#### Authorization: `token required`

#### Parameters:

| Parameter | Description                |
| --------- | -------------------------- |
| `id`      | The id of the conversation |

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

#### Authorization: `token required`

#### Parameters:

| Parameter        | Description                |
| ---------------- | -------------------------- |
| `conversationID` | The id of the conversation |
| `messageID`      | The id of the message      |

## Update a message

### PATCH /conversations/:conversationID/messages/:messageID

#### Authorization: `token required`

#### Parameters

| Parameter        | Description                |
| ---------------- | -------------------------- |
| `conversationID` | The id of the conversation |
| `messageID`      | The id of the message      |

Response: 200 OK

#### Body Parameters:

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `content` | `string` | The updated message content |

## Leave a conversation

### DELETE /conversations/:conversationID/participants

#### Authorization: `token required`

#### Parameters:

| Parameter        | Type     | Description                |
| ---------------- | -------- | -------------------------- |
| `conversationID` | `string` | The id of the conversation |

Response: 200 OK

## Delete a message

### DELETE /conversations/:conversationID/messages/:messageID

#### Authorization: `token required`

#### Parameters:

| Parameter        | Description                |
| ---------------- | -------------------------- |
| `conversationID` | The id of the conversation |
| `messageID`      | The id of the message      |

Response: 200 OK

---

## Post a new activity

### POST /activities

#### Authorization: `token required`

#### Body Parameters:

| Parameter     | Type     | Description                                                       |
| ------------- | -------- | ----------------------------------------------------------------- |
| `description` | `string` | A description of the activity (optional)                          |
| `type`        | `string` | The type of activity i.e. BiKING, RUNNING                         |
| `date`        | `string` | The date of the activity formatted as `MM-DD-YYYY`                |
| `measurement` | `string` | The unit of measurement to measure activity such as steps or time |
| `units`       | `string` | The units the activity is measured in                             |
| `value`       | `string` | The amount of activity                                            |

Response: 200 OK

## Update an activity

### PATCH /activities/:id

#### Authorization: `token required`

#### Parameters:

| Parameter | Description            |
| --------- | ---------------------- |
| `id`      | The id of the activity |

#### Body Parameters:

| Parameter     | Type     | Description                                                       |
| ------------- | -------- | ----------------------------------------------------------------- |
| `description` | `string` | A description of the activity                                     |
| `type`        | `string` | The type of activity i.e. BiKING, RUNNING                         |
| `date`        | `string` | The date of the activity formatted as `MM-DD-YYYY`                |
| `measurement` | `string` | The unit of measurement to measure activity such as steps or time |
| `units`       | `string` | The units the activity is measured in                             |
| `value`       | `string` | The amount of activity                                            |

Reponse: 200 OK

## Get an activity

### GET /activities/:id

#### Authorization: `token required`

#### Parameters:

| Parameter | Description            |
| --------- | ---------------------- |
| `id`      | The id of the activity |

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

### GET /activities

#### Authorization: `token required`

Response: 200 OK

## Make a query of activities

### GET /activities/?user_id={{userID}}&type={{type}}&start_date={start_date}&end_date={end_date}

#### Authorization: `token required`

#### Query Parameters:

| Parameter    | Description                                  |
| ------------ | -------------------------------------------- |
| `user_id`    | The user id of the actitivies                |
| `type`       | The type of activity i.e. BiKING, RUNNING    |
| `start_date` | The beginning date formatted as `MM-DD-YYYY` |
| `end_date`   | The end date formatted as `MM-DD-YYYY`       |

start_date and end_date are inclusive, all activities between those two dates will be returned

Response: 200 OK

---

## Create a new record

### POST /records

#### Body Parameters:

| Parameter | Type     | Description                                                            |
| --------- | -------- | ---------------------------------------------------------------------- |
| `date`    | `string` | The date of the when the record was achieved formatted as `MM-DD-YYYY` |
| `type`    | `string` | The type of record                                                     |

Response: 200 OK

## Update a new record

### PATCH /records/:id

#### Authorization: `token required`

#### Parameter:

| Parameter | Description          |
| --------- | -------------------- |
| `id`      | The id of the record |

Response: 200 OK

#### Body Parameters:

| Parameter | Type     | Description                                                           |
| --------- | -------- | --------------------------------------------------------------------- |
| `date`    | `string` | The date of the when the record was achieved formattedas `MM-DD-YYYY` |
| `type`    | `string` | The type of record                                                    |

Response: 200 OK

## Get a record

### GET /records/:id

#### Authorization: `token required`

#### Parameter:

| Parameter | Description          |
| --------- | -------------------- |
| `id`      | The id of the record |

Response: 200 OK

Example:

```
{
    "_id": "5c86d0e04f4735312dc43a64",
    "type": "20,000 Steps In A Day",
    "date": "2019-03-10T06:00:00.000Z",
    "user_id": "5c857dcf0e499e27b1cdf0c8",
    "__v": 0
}
```

## Delete a record

### DELETE /records/:id

#### Authorization: `token required`

#### Parameter:

| Parameter | Description          |
| --------- | -------------------- |
| `id`      | The id of the record |

Response: 204

# Testing on Postman

1. Download Postman at https://www.getpostman.com

2. Select Import and import the file in the folder server/tests "Capstone-API.postman_collection.json"

3. Click "Manage Environment" in top right corner and import environment found in server/tests "CapstoneEnv.postman_environment.json"
