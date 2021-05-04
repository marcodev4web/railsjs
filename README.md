# Rails.js (Beta)
A REST API Framework based on the popular [Express.js](https://expressjs.com) and [Mongoose](https://mongoosejs.com).

## Our Goal
Boost API development process with NodeJS by tacking care of daily tasks making developers focusing on the app itself

## Features
* Support SPA Apps
* CRUD Endpoints
* Controller With Hooks
* Authentication (JWT)
* Error Handling
* Logging
* Seperate Logic In Files (controllers, validators, models)
* Setup Admin User With One Command

## Future Features
* Different Authentication Strategies (using passport.js)
* Support WebSockets (using socket.io)
* Support Uploading Large Files
* Support Image Optimization

## Installation
1- Fetch it from GitHub

``` 
$ git fetch http://github.com/Marco4WebDev/expresso
```

2- Download Dependencies

``` 
$ npm install
```

## Get Started

### Create Your First Model

Models/Product.js
```javascript
const mongoose = require('mongoose');
const baseSchema = require('./BaseSchema');     // include base schema

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required
    },
    stock: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

schema.add(baseSchema);     // add base schema to your schema

module.exports = mongoose.model('Product', schema)
```

### Create Your First Controller

Controllers/ProductController.js
```javascript
const Controller = require('./Controller');     // base controller
const Product = require('../models/Product');       // model linked to the controller

const ProductController = new Controller(Product);

module.exports = ProductController;
```
> Every Controller has find(), fetch(), create(), update(), delete() methods for CRUD endpoints.

### Write Your First Route

routes/api.js
```javascript
........

const valiadtor = require('../validators/productValidator');    // validation logic in seperate file

router.resource('/products', valdiator, ProductController); // add CRUD endpoints for products

router.post('/posts', PostController.create()) // Add create endpoint for posts
```
#### CRUD Endpoints Explained

| Endpoint | Method | Route         | Controller.method | Hooks                                                    |
|----------|--------|---------------|-------------------|----------------------------------------------------------|
| Find     | GET    | /products     | find()            | beforeFind(), afterFind()                                |
| Fetch    | GET    | /products/:id | fetch()           | beforeFetch(), afterFetch()                              |
| Create   | POST   | /products     | create()          | beforeCreate(), beforeSave(), afterSave(), afterCreate() |
| Update   | PATCH  | /products/:id | update()          | beforeUpdate(), beforeSave(), afterSave(), afterUpdate() |
| Delete   | DELETE | /products/:id | delete()          | beforeDelete(), afterDelete()                           |

> You can use hooks to extend endpoint logic:
```javascript
ProductController.beforeCreate = (req, res, next) => {
    // Your logic here
    // Don't forget next() :)
    next()
}
```
> After hooks have access to the resource by using `req.$data`.

> Before hooks have access to the request body by using `req.$body`.

> All hooks have access to the response by using `req.$res`.

### Write Route Validator

> Every validator should have create and update arrays.

validators/productValidator.js
```javascript
const { body } = require('express-validator');

// for create endpoint
exports.create = [
    // validation logic
];

// for update endpoint
exports.update = [
    // validation logic
];
```

### Run Your App

Development
```
$ npm run dev
```

Production
```
$ npm run start
```

Test
```
$ npm run test
```