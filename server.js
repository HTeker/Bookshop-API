require('dotenv').load();

var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000
	router = express.Router(),
	bodyParser = require('body-parser'),
    product = require('./routes/product'),
	category = require('./routes/category'),
    db = require('./data/db'),
    seeder = require('./data/seeder');

db.sync({force: true}).then(function(){
    seeder.seed();
});

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

app.route('/category/search/:query')
    .get(category.searchCategories);

app.listen(port, function(){
    console.log('Running API on port: ' + port);
});

module.exports = app;