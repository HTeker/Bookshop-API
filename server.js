require("dotenv").load();

var express = require("express"),
	app = express(),
	port = process.env.PORT || 3000
	router = express.Router(),
	bodyParser = require('body-parser'),
	product = require('./routes/product');


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.route("/product")
    .get(product.getProducts)
    .post(product.saveProduct);

app.listen(port, function(){
    console.log('Running API on port: ' + port);
});

module.exports = app;