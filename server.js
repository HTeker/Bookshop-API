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

/*if(process.env.NODE_ENV != 'test'){
    db.sync({force: true}).then(function(){
        seeder.seed();
    });
}*/

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


/* PRODUCTS */
app.route('/product')
    .get(product.getProducts)
    .post(auth.verifyAdminToken, product.createProduct);

app.route('/product/newest')
    .get(product.getNewestProducts);

app.route('/product/random')
    .get(product.getRandomProducts);

app.route('/product/not-in-stock')
    .get(auth.verifyAdminToken, product.getProductsNotInStock);

app.route('/product/:id')
    .get(product.getProductById)
    .delete(auth.verifyAdminToken, product.deleteProductById)
    .put(auth.verifyAdminToken, product.updateProductById);

app.route('/product/:id/category')
    .get(product.getCategories)
    .post(auth.verifyAdminToken, product.addCategories)
    .delete(auth.verifyAdminToken, product.removeCategories);

app.route('/product/search/:query')
    .get(product.searchProducts);


/* CATEGORIES */
app.route('/category')
    .get(category.getCategories)
    .post(auth.verifyAdminToken, category.createCategory);

app.route('/category/newest')
    .get(category.getNewestCategories);

app.route('/category/random')
    .get(category.getRandomCategories);

app.route('/category/:id')
    .get(category.getCategoryById)
    .delete(auth.verifyAdminToken, category.deleteCategoryById)
    .put(auth.verifyAdminToken, category.updateCategoryById);

app.route('/category/:id/product')
    .get(category.getProducts)
    .post(auth.verifyAdminToken, category.addProducts)
    .delete(auth.verifyAdminToken, category.removeProducts);

app.route('/category/search/:query')
    .get(category.searchCategories);


/* USERS */
app.route('/user')
    .get(auth.verifyAdminToken, user.getUsers)
    .post(auth.verifyAdminToken, user.createUser);

app.route('/user/:useremail')
    .get(auth.verifyAdminToken, user.getUserById)
    .delete(auth.verifyAdminToken, user.deleteUserById)
    .put(auth.verifyAdminToken, user.updateUserById);

app.route('/user/search/:query')
    .get(auth.verifyAdminToken, user.searchUsers);

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
    .get(auth.verifyUserToken, order.getOrdersOfUser)
    .post(auth.verifyUserToken, order.createOrder);

app.route('/user/:useremail/order/:oid')
    .get(auth.verifyUserToken, order.getOrderById);

// ADMIN REQUESTS
app.route('/orders')
    .get(auth.verifyAdminToken, order.getOrders);

// GENERAL REQUESTS
//app.route();

/* AUTH */
app.route('/login')
    .post(auth.login);

app.route('/signup')
    .post(auth.signup);

app.listen(port, function(){
    console.log('Running API on port: ' + port);
});

module.exports = app;
