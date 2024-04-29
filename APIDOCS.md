# List Api Documentation

## Endpoints:

List of available endpoints:

- `POST /user/login`
- `POST /user/register`
- `POST /product`
- `GET /product`
- `GET /product/:id`
- `PATCH /product/:id`
- `DELETE /product/:id`

## 1. POST /user/login

### description:

Login User to get Access Token

_**Response (200 - OK)**_

**body**

```json
{
	"email": "superadmin@admin.com",
	"password": "superadmin"
}
```

```json
{
	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InN1cGVyYWRtaW4iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTcxNDM2MzQ4Nn0.SB8TRSCDg42fJXqaxErsurS3qGFi1Snx6Jn4qa9hs5g"
}
```

_**Response (401 - Unauthorized)**_

**body**

```json
{
	"email": "superad@admin.com",
	"password": "super"
}
```

**output**

```json
{
	"message": "Invalid email/password"
}
```

_**Response (400 - Bad Request)**_

**body**

```json
{
	"email": "",
	"password": "super"
}
```

**output**

```json
{
    "message": "Email is required"
}
...
{
    "message": "Password is required"
}
```

## 2. POST /user/register

### description

Register new user (only for superuser)

_**Response (201 - Created)**_

**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**body**

```json
{
	"username": "fikilifadly",
	"email": "fikilifadly@gmail.com",
	"password": "12345678"
}
```

**output**

```json
{
	"message": "User fikilifadly has been created"
}
```

_**Response (400 - Bad Request)**_

**body**

```json
{
	"username": "empty || null",
	"email": "empty || null || already registered email",
	"password": "empty || null"
}
```

**output**

```json
{
    "message": "Username is required"
}
...
{
    "message": "Email is required"
}
...
{
    "message": "Password is required"
}
...
{
    "message": "Email already registered"
}
```

_**Response (401 - Unauthorized)**_

**header**

```json
{
	"access_token": "string"|"invalid token"
}
```

**output**

```json
{
	"message": "Invalid token"
}
```

_**Response (403 - Forbidden)**_

**header**

```json
{
	"access_token": "string"|"valid token but the role not superuser"
}
```

**output**

```json
{
	"message": "You dont have permission"
}
```

## 3. POST /product

### description

Add new product

_**Response (200 - Ok)**_

**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**body**

```json
{
	"name": "infinix",
	"description": "loremipsum dolor",
	"price": 130,
	"stock": 2,
	"image": "test.jpg"
}
```

**output**

```json
{
	"message": "Product infinix successfully created"
}
```

_**Response (400 - Bad Request)**_

**body**

```json
{
	"name": "empty|null",
	"description": "empty|null",
	"image": "empty|null|invalid format(jpg,png,jpeg)"
}
```

**output**

```json
{
    "message": "Name is required"
}
...
{
    "message": "Description is required"
}
...
{
    "message": "Image is required"
}
...
{
    "message": "Price is required"
}
...
{
    "message": "Stock is required"
}
...
{
    "message": "Image File type not supported"
}
```

_**Response (401 - Unauthorized)**_

**header**

```json
{
	"access_token": "string"|"invalid token"
}
```

**output**

```json
{
	"message": "Invalid token"
}
```

_**Response (403 - Forbidden)**_

**header**

```json
{
	"access_token": "string"|"valid token but the role not superuser"
}
```

**output**

```json
{
	"message": "You dont have permission"
}
```

## 4. GET /product

### description

Get all product (only superadmin that can access whole product not restricted by userid)

_**Response (200 - Ok)**_

**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**body**

**output**

```json
[
     {
        "id": 4,
        "name": "OnePlus 11 Pro",
        "description": "The OnePlus 11 Pro delivers super-fast charging, a smooth 120Hz display, and a powerful Snapdragon 8 Gen 2 processor at a competitive price.",
        "price": 899,
        "stock": 75,
        "image": "placeholder_image.jpg",
        "UserId": 2,
        "createdAt": "2024-04-28T12:48:16.342Z",
        "updatedAt": "2024-04-28T12:48:16.342Z",
        "User": {
            "username": "admin1"
        }
    },
    {
        "id": 3,
        "name": "Google Pixel 6a",
        "description": "The Google Pixel 6a offers a great balance of price and performance, with a powerful Google Tensor chip, a capable dual-camera system, and a clean Android experience.",
        "price": 449,
        "stock": 100,
        "image": "placeholder_image.jpg",
        "UserId": 3,
        "createdAt": "2024-04-28T12:48:16.342Z",
        "updatedAt": "2024-04-28T12:48:16.342Z",
        "User": {
            "username": "admin2"
        }
    },
    ....
]
```

_**Response (401 - Unauthorized)**_

**header**

```json
{
	"access_token": "string"|"invalid token"
}
```

**output**

```json
{
	"message": "Invalid token"
}
```

_**Response (403 - Forbidden)**_

**header**

```json
{
	"access_token": "string"|"valid token but the role not superuser"
}
```

**output**

```json
{
	"message": "You dont have permission"
}
```

## 5. GET /product/:id

### description

Get product by id (only superadmin that can access whole product not restricted by userid)

_**Response (200 - Ok)**_

**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**params**

```json
{
	"id": "integer"
}
```

**output**

```json
{
	"id": 1,
	"name": "Samsung Galaxy S23 Ultra",
	"description": "The Samsung Galaxy S23 Ultra is a top-of-the-line phone with a powerful processor, a stunning camera system, and a long-lasting battery.",
	"price": 1188,
	"stock": 3,
	"image": "http://res.cloudinary.com/dw4g6dcgn/image/upload/v1714324344/10xers/kkzqk0u67giij5defvmg.jpg",
	"UserId": 3,
	"createdAt": "2024-04-28T12:48:16.342Z",
	"updatedAt": "2024-04-28T17:12:25.919Z",
	"User": {
		"username": "admin2"
	}
}
```

_**Response (401 - Unauthorized)**_

**header**

```json
{
	"access_token": "string"|"invalid token"
}
```

**output**

```json
{
	"message": "Invalid token"
}
```

_**Response (403 - Forbidden)**_

**header**

```json
{
	"access_token": "string"|"valid token but the role not superuser and not product that created by this id"
}
```

**output**

```json
{
	"message": "You dont have permission"
}
```

_**Response (404 - Not Found)**_

**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**params**

```json
{
	"id": "invalid product id"
}
```

**output**

```json
{
	"message": "Product not found"
}
```

## 6. PATCH /product/:id

### description

Patch/update product by id (only superadmin that can access whole product not restricted by userid)

_**Response (200 - Ok)**_
**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**params**

```json
{
	"id": "integer"
}
```

**body**

```json
{
	"stock": 3
}
```

**output**

```json
{
	"message": "Product Samsung Galaxy S23 Ultra successfully updated"
}
```

_**Response (401 - Unauthorized)**_

**header**

```json
{
	"access_token": "string"|"invalid token"
}
```

**output**

```json
{
	"message": "Invalid token"
}
```

_**Response (403 - Forbidden)**_

**header**

```json
{
	"access_token": "string"|"valid token but the role not superuser and not product that created by this id"
}
```

**output**

```json
{
	"message": "You dont have permission"
}
```

_**Response (404 - Not Found)**_

**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**params**

```json
{
	"id": "invalid product id"
}
```

**output**

```json
{
	"message": "Product not found"
}
```

## 6. DELETE /product/:id

### description

DELETE product by id (only superadmin that can access whole product not restricted by userid)

_**Response (200 - Ok)**_
**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**params**

```json
{
	"id": "integer"
}
```

**output**

```json
{
	"message": "Product infinix successfully deleted"
}
```

_**Response (401 - Unauthorized)**_

**header**

```json
{
	"access_token": "string"|"invalid token"
}
```

**output**

```json
{
	"message": "Invalid token"
}
```

_**Response (403 - Forbidden)**_

**header**

```json
{
	"access_token": "string"|"valid token but the role not superuser and not product that created by this id"
}
```

**output**

```json
{
	"message": "You dont have permission"
}
```

_**Response (404 - Not Found)**_

**header**

```json
{
	"access_token": "string"|"validtoken"
}
```

**params**

```json
{
	"id": "invalid product id"
}
```

**output**

```json
{
	"message": "Product not found"
}
```
