# MultiplayerChess Documentation

## User

```md
- username : string, required, unique
- password : string, required
```

## Endpoints

List of avaiable endpoints :

- `POST /register`
- `POST /login`

## 1. POST /register

Request:

- body:

```json
{
  "username": "string",
  "password": "string"
}
```

Response (201 - Created)

```json
{
  "id": "integer",
  "username": "string"
}
```

Response (400 - Bad Request)

```json
{
  "message": "Username is required"
}
OR
{
  "message": "Username must be unique"
}
OR
{
  "message": "Password is required"
}
```

## 2. POST /login

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

Response (200 - OK)

```json
{
  "access_token": "string"
}
```

Response (400 - Bad Request)

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
```

Response (401 - Unauthorized)

```json
{
  "message": "Invalid email/password"
}
```

## Global Error

Response (500 - Internal Server Error)

```json
{
  "message": "Internal server error"
}
```
