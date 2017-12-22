require('dotenv').load();

var express = require('express'),
	app = express(),
	port = process.env.PORT || 8080
	router = express.Router(),
	bodyParser = require('body-parser'),
    product = require('./routes/product'),
    category = require('./routes/category'),
    user = require('./routes/user'),
    wishlist = require('./routes/wishlist'),
    order = require('./routes/order'),
	auth = require('./routes/auth'),
    db = require('./data/db'),
    seeder = require('./data/seeder')
    Associations = require('./models/associations');

Associations.associate();

if(process.env.NODE_ENV != 'test'){
    db.sync({force: true}).then(function(){
        seeder.seed();
    });
}

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/* PRODUCTS */
app.route('/product')
    .get(product.getProducts)
    .post(product.createProduct);

app.route('/product/:id')
    .get(product.getProductById)
    .delete(product.deleteProductById)
    .put(product.updateProductById);

app.route('/product/:id/category')
    .get(product.getCategories)
    .post(product.addCategories)
    .delete(product.removeCategories);

app.route('/product/search/:query')
    .get(product.searchProducts);


/* CATEGORIES */
app.route('/category')
    .get(category.getCategories)
    .post(category.createCategory);

app.route('/category/:id')
    .get(category.getCategoryById)
    .delete(category.deleteCategoryById)
    .put(category.updateCategoryById);

app.route('/category/:id/product')
    .get(category.getProducts)
    .post(category.addProducts)
    .delete(category.removeProducts);

app.route('/category/search/:query')
    .get(category.searchCategories);


/* USERS */
app.route('/user')
    .get(user.getUsers)
    .post(user.createUser);

app.route('/user/:useremail')
    .get(auth.verifyUserToken, user.getUserById)
    .delete(auth.verifyUserToken, user.deleteUserById)
    .put(auth.verifyUserToken, user.updateUserById);

app.route('/user/search/:query')
    .get(user.searchUsers);

// USER WISHLISTS
app.route('/user/:useremail/wishlist')
    .get(auth.verifyUserToken, wishlist.getWishlists)
    .post(auth.verifyUserToken, wishlist.createWishlist);

app.route('/user/:useremail/wishlist/:wid')
    .get(auth.verifyUserToken, wishlist.getWishlistById)
    .delete(auth.verifyUserToken, wishlist.deleteWishlistById)
    .put(auth.verifyUserToken, wishlist.updateWishlistById);

app.route('/user/:useremail/wishlist/search/:query')
    .get(auth.verifyUserToken, wishlist.searchWishlists);

// USER WISHLIST PRODUCTS
app.route('/user/:useremail/wishlist/:wid/product')
    .get(auth.verifyUserToken, wishlist.getProducts)
    .post(auth.verifyUserToken, wishlist.addProducts)
    .delete(auth.verifyUserToken, wishlist.removeProducts);

// USER ORDERS
app.route('/user/:useremail/order')
    .get(auth.verifyUserToken, order.getOrders)
    .post(auth.verifyUserToken, order.createOrder);

app.route('/user/:useremail/order/:oid')
    .get(auth.verifyUserToken, order.getOrderById);

/* AUTH */
app.route('/login')
    .post(auth.login);

app.listen(port, function(){
    console.log('Running API on port: ' + port);
});

module.exports = app;