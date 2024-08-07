# User API Specification

## Register User API

Endpoint : POST /api/users

Request Body:

```json
{
  "username": "rossi",
  "password": "secret",
  "name": "Fakhri Rossi"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "rossi",
    "name": "Fakhri Rossi"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "rossi",
  "password": "secret"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
"errors": "Username or password wrong"
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "Fakhri Rossi", // optional
  "password": "new password" //optional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "rossi",
    "name": "Fakhri Rossi"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Enpoint : GET /api/users/current

Headers :

- Authorization: token

Response Body Success:

```json
{
  "data": {
    "username": "rossi",
    "name": "Fakhri Rossi"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Edpoint : DELETE /api/users/logout

Headers :

- Authorization

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```
