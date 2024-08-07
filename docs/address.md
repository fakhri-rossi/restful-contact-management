# Address API Specification

## Create Address API

Endpoint : POST /api/contacts/:contact_id/addresses

Headers:

- Authoriation : token

Request Body :

```json
{
  "street": "Jl Kemang",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "country": "Indonesia",
  "postal_code": "12212"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jl Kemang",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "country": "Indonesia",
    "postal_code": "12212"
  }
}
```

Response Body Error :

```json
{
  "errors": "Country is Required"
}
```

## Update Address API

Endpoint : PUT /api/contacts/:contact_id/addresses/:address_id

Headers:

- Authoriation : token

Request Body :

```json
{
  "street": "Jl Kemang",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "country": "Indonesia",
  "postal_code": "12212"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jl Kemang",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "country": "Indonesia",
    "postal_code": "12212"
  }
}
```

Response Body Error :

```json
{
  "errors": "Country is required"
}
```

## Get Address API

Endpoint : GET /api/contacts/:contact_id/addresses/:address_id

Headers:

- Authoriation : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jl Kemang",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "country": "Indonesia",
    "postal_code": "12212"
  }
}
```

Response Body Error :

```json
{
  "errors": "Ccontact is not found"
}
```

## List Address API

Endpoint : GET /api/contacts/:contact_id/addresses

Headers:

- Authoriation : token

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jl Kemang",
      "city": "Jakarta",
      "province": "DKI Jakarta",
      "country": "Indonesia",
      "postal_code": "12212"
    },
    {
      "id": 2,
      "street": "Jl Kemang",
      "city": "Jakarta",
      "province": "DKI Jakarta",
      "country": "Indonesia",
      "postal_code": "12212"
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## Remove Address API

Endpoint : DELETE /api/contacts/:contact_id/addresses/:address_id

Headers:

- Authoriation : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Contact or address is not found"
}
```
