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

app.route('/user/:id')
    .get(user.getUserById)
    .delete(user.deleteUserById)
    .put(user.updateUserById);

app.route('/user/search/:query')
    .get(user.searchUsers);

// USER WISHLISTS
app.route('/user/:id/wishlist')
    .get(wishlist.getWishlists)
    .post(wishlist.createWishlist);

app.route('/user/:uid/wishlist/:wid')
    .get(wishlist.getWishlistById)
    .delete(wishlist.deleteWishlistById)
    .put(wishlist.updateWishlistById);


app.listen(port, function(){
    console.log('Running API on port: ' + port);
});

module.exports = app;