var products = [];

module.exports = {
	getProducts: (req, res) => {
	    res.json(products).end();
	},

	saveProduct: (req, res) => {
		products.push(req.body);
		res.status(201).end();
	}
};