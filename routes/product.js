var products = [];

module.exports = {
	getProducts: (req, res) => {
	    res.json(products).end();
	},

	saveProduct: (req, res) => {
		products.push(req.body);
		res.status(201).end();
	},

	getProductById: (req, res) => {
		for(key in products){
			if(products[key].isbn == req.params.id){
				res.json(products[key]).end();
			}
		}
		res.status(404).end();
	}
};