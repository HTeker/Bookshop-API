var products = [];

function getProducts(req, res) {
    res.json(products).end();
}

function saveProduct(req, res) {
	products.push(req.body);
	res.status(201).end();
}

module.exports = { getProducts, saveProduct };