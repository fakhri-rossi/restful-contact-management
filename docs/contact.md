# Contact API Specification

## Create Contact API

Endpoint : POST /api/contacts

Headers:

- Authorization

Request Body :

```json
{
  "first_name": "Fakhri",
  "last_name": "Rossi",
  "email": "rossi@gmail.com",
  "phone": "232122223"
}
```

Response Body Success :

```json
{
  "data": {
    "_id": "ObjectId",
    "first_name": "Fakhri",
    "last_name": "Rossi",
    "email": "rossi@gmail.com",
    "phone": "232122223"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email format is not valid"
}
```

## Update Contact API

Endpoint : PUT /api/contacts/:id

Headers:

- Authorization

Request Body :

```json
{
  "first_name": "Fakhri",
  "last_name": "Rossi",
  "email": "rossi@gmail.com",
  "phone": "232122223"
}
```

Response Body Success :

```json
{
  "data": {
    "_id": "ObjectId",
    "first_name": "Fakhri",
    "last_name": "Rossi",
    "email": "rossi@gmail.com",
    "phone": "232122223"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email format is not valid"
}
```

## Get Contact API

Endpoint : GET /api/contacts/:id

Headers:

- Authorization

Response Body Success :

```json
{
  "data": {
    "_id": "ObjectId",
    "first_name": "Fakhri",
    "last_name": "Rossi",
    "email": "rossi@gmail.com",
    "phone": "232122223"
  }
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## Search Contact API

Endpoint : GET /api/contacts

Headers:

- Authorization

Query params:

- name : search by first_name or last_name, using like, optional
- email : searh by email using like, optional
- phone : search by phone using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "_id": "ObjectId",
      "first_name": "Fakhri",
      "last_name": "Rossi",
      "email": "rossi@gmail.com",
      "phone": "232122223"
    },
    {
      "_id": "ObjectId",
      "first_name": "Andi",
      "last_name": "Surandi",
      "email": "andi@gmail.com",
      "phone": "232166223"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

Response Body Error :

```json

```

## Remove Contact API

Endpoint : DELETE /api/contacts/:id

Headers:

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
  "errors": "Contact is not found"
}
```
