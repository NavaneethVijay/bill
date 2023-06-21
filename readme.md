## Supermarket Billing Management
This application is build using **express.js** as backend and consists for **REST APIs** to manage cart and discounts during checkout. It uses Supabase as database provider.
The product prices depends on the Qty at which is being purchased. Customers will get special prices on the products based on the qty.

Node version: **v14.21.3**

## Installation for local usage

**Install packages and start express server**

    npm install
    npm start

    Express.js server starts on port 9000

**Install react application**

    cd client
    npm install
    npm run start

**API endpoint** is specified in `.env.local`
*Default value*

    REACT_APP_API_BASE_URL=http://localhost:9000/api

**Database Details**
Tables used

 - products - ( with sample Data )
 - cart
 - cart_item
 - customer
 - invoice
 - discounts - ( with sample Data )

**Assumptions**
- Database authorization is not implemented, since its used during checkout we want to implement an admin user who will be allowed to access customer and cart details.
- Response of the custom APIs depends on Supabase REST APIs as well.
- Products and Discount Data is already available, there are no APIs for managing these entities apart from fetching the data.
- Pagination for Products and Discounts are not implemented.
- Supabase queries are not optimised for fetching specific fields from database.
- {{base_url}} - End point of the express server.  ex: http://localhost:3000


## Available Rest APIs
### 1. Customer Management

#### Create new Customer

**Endpoint:** `{{base_url}}/api/customer/create`
**Method:** POST

Request Parameters
**name: String!**
**email: String!**
**mobile: String!**


*Sample Request*

    {
	    "email": "sainavaneeth@gmail.com",
	    "mobile": 9886002202,
	    "name": "Navaneeth"
    }

**Response Data**
Response consists of basic customer info, cart info which contains the products which are added and totals based on available discount data.

*Sample Response*

    {
        "data": {
            "id": 35,
            "created_at": "2023-06-19T11:18:19.482846+00:00",
            "name": "vijay",
            "mobile": "9886002202",
            "email": "sainavaneeth@gmail.com",
            "cart": {
                "cartId": 33,
                "subtotal": null,
                "grand_total": null,
                "discount": null,
                "customer_id": 35
            }
        },
        "message": "Successfully created account"
    }
----
#### Get Customer info

**Endpoint:** `{{base_url}}/api/customer`
**Method:** POST

Request Parameters
**email: String**

*Sample Request*

    {
    "email": "sainavaneeth@gmail.com"
    }

**Response Data**
Response consists of basic customer info, cart info which contains the products which are added and totals based on available discount data.

*Sample Response*

    {
        "data": {
            "id": 38,
            "created_at": "2023-06-19T11:27:43.70174+00:00",
            "name": "Navaneeth",
            "mobile": "9886002292",
            "email": "sainavaneeth@gmail.com",
            "cart": {
                "cartId": 36,
                "items": [
                    {
                        "id": 96,
                        "sku": "3FADP0L31BR239195",
                        "name": "Wine - Niagara Peninsula Vqa",
                        "price": 8,
                        "regular_price": 10,
                        "qty": 2,
                        "discount_value": 2,
                        "discount_type": null
                    },
                    {
                        "id": 97,
                        "sku": "1N4AA5APXAC101031",
                        "name": "Sansho Powder",
                        "price": 435,
                        "regular_price": 480,
                        "qty": 10,
                        "discount_value": 45,
                        "discount_type": null
                    }
                ],
                "subtotal": 443,
                "grand_total": 490,
                "discount": 47,
            }
        }
    }

### 2. Cart Management
####  - Get Customer Cart

**Endpoint:** `{{base_url}}/api/cart`
**Method:** POST

Request Parameters
**cart_id: Int!**

*Sample Request*

    {
	    "cart_id": 36
    }

**Response Data**
Response consists of cart info with calculated totals.

*Sample Response*

    {
        "status": true,
        "message": "Successful"
        "data": {
            "cartId": 36,
            "items": [
                {
                    "id": 96,
                    "sku": "3FADP0L31BR239195",
                    "name": "Wine - Niagara Peninsula Vqa",
                    "price": 8,
                    "regular_price": 10,
                    "qty": 2,
                    "discount_value": 2,
                    "discount_type": null
                },
                {
                    "id": 97,
                    "sku": "1N4AA5APXAC101031",
                    "name": "Sansho Powder",
                    "price": 435,
                    "regular_price": 480,
                    "qty": 10,
                    "discount_value": 45,
                    "discount_type": null
                }
            ],
            "subtotal": 443,
            "grand_total": 490,
            "discount": 47,
            "customer_id": 38
        }
    }

####  - Add Product to cart

**Endpoint:** `{{base_url}}/api/cart/add`
**Method:** POST

Request Parameters
**cart_id: Int!**
**sku: String!**
**qty: Int!**

*Sample Request*

    {
    	"cart_id": 36,
    	"sku": "3FADP0L31BR239195",
    	"qty": 2
    }

**Response Data**
Adding the product to cart returns the updated cart as response, which is similar to the Customer cart API

*Sample Response*

    {
        "status": true,
        "message": "Successfully added !",
        "data": {
            "cartId": 36,
            "items": [
                {
                    "id": 97,
                    "sku": "1N4AA5APXAC101031",
                    "name": "Sansho Powder",
                    "price": 435,
                    "regular_price": 480,
                    "qty": 10,
                    "discount_value": 45,
                    "discount_type": null
                },
                {
                    "id": 96,
                    "sku": "3FADP0L31BR239195",
                    "name": "Wine - Niagara Peninsula Vqa",
                    "price": 8,
                    "regular_price": 10,
                    "qty": 2,
                    "discount_value": 2,
                    "discount_type": null
                }
            ],
            "subtotal": 443,
            "grand_total": 490,
            "discount": 47,
            "customer_id": 38
        }
    }

####  - Remove Product from cart

**Endpoint:** `{{base_url}}/api/cart/remove`
**Method:** POST

Request Parameters
**cart_id: Int!**
**cart_item_id: Int!**

*Sample Request*

    {
	    "cart_id": 36,
	    "cart_item_id": 96
    }

**Response Data**
Adding the product to cart returns the updated cart as response, which is similar to the Customer cart API

*Sample Response*

    {
        "status": true,
        "message": "Successfully removed item from cart",
        "data": {
            "cartId": 36,
            "items": [
                {
                    "id": 97,
                    "sku": "1N4AA5APXAC101031",
                    "name": "Sansho Powder",
                    "price": 435,
                    "regular_price": 480,
                    "qty": 10,
                    "discount_value": 45,
                    "discount_type": null
                }
            ],
            "subtotal": 435,
            "grand_total": 480,
            "discount": 45,
            "customer_id": 38
        }
    }


####  - Create Purchase

**Endpoint:** `{{base_url}}/api/customer/invoice`
**Method:** POST

Request Parameters
**email: String!**

*Sample Request*

    {
    	"email": "sainavaneeth@gmail.com"
    }

**Response Data**
Converts the existing cart to an order and creates an entry invoice table with paid status.
Response contains the invoice number and order details

*Sample Response*

    {
        "status": "paid",
        "invoice_id": 15,
        "cart_id": 36,
        "customer_id": 38,
        "created_at": "2023-06-19T12:51:58.651423+00:00",
        "cart": {
            "id": 36,
            "subtotal": 435,
            "grand_total": 480,
            "discount": 45,
            "created_at": "2023-06-19T11:27:43.874693+00:00",
            "customer_id": 38,
            "is_active": false
        },
        "customer": {
            "name": "Navaneeth",
            "email": "sainavaneeth@gmail.com",
            "mobile": "9886002292"
        }
    }

### MISC Endpoints

**Get products**
Returns all available products in the inventory

**Endpoint:** `{{base_url}}/api/products`
**Method:** GET

---
**Get Discounts**
Returns all available discounts for the products

**Endpoint:** `{{base_url}}/api/products/discounts`
**Method:** GET
