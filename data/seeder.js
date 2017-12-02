const Product = require('../models/product');
//const Category = require('../models/category');

module.exports = {
	seed: () => {
		Product.create({
			id: '12345678',
			name: 'Book #1',
			description: 'This is the first book that has been seeded.',
			price: 19.99,
			imgUrl: 'http://example.com/',
			stock: 10,
			deliveryDays: 5
		});

		Product.create({
			id: '12345679',
			name: 'Book #2',
			description: 'This is the second book that has been seeded.',
			price: 29.99,
			imgUrl: 'http://example.com/',
			stock: 20,
			deliveryDays: 5
		});

		Product.create({
			id: '12345680',
			name: 'Book #3',
			description: 'This is the third book that has been seeded.',
			price: 39.99,
			imgUrl: 'http://example.com/',
			stock: 30,
			deliveryDays: 5
		});
	}
}