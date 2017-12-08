require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db');

describe('Product', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			done();
		});
	});

	it('get all products', function*(){
		let products = (yield request(server).get('/product').expect(200).end()).body;
		products.should.be.a('array');
	});

	it('save a product', function*(){
		let products = (yield request(server).get('/product').expect(200).end()).body;

		let new_product = { id: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 };
		yield request(server).post('/product').send(new_product).expect(201).end();

		let newProducts = (yield request(server).get('/product').expect(200).end()).body;

		newProducts.should.have.lengthOf(products.length + 1);
	});

	it('get a product by id', function*(){
		let new_product = { id: '0132350881', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 };
		yield request(server).post('/product').send(new_product).expect(201).end();

		let product = (yield request(server).get('/product/0132350881').expect(200).end()).body;
		delete product.createdAt;
		delete product.updatedAt;
		product.should.deep.equal(new_product);
	});

	it('delete a product by id', function*(){

		let new_product = { id: '01323523423', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 };
		yield request(server).post('/product').send(new_product).expect(201).end();

		let products = (yield request(server).get('/product').expect(200).end()).body;

		yield request(server).delete('/product/01323523423').expect(200).end();

		let newProducts = (yield request(server).get('/product').expect(200).end()).body;

		newProducts.should.have.lengthOf(products.length - 1);
	});

	it('update a product by id', function*(){
		let new_product = { id: '0132350886', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 };
		yield request(server).post('/product').send(new_product).expect(201).end();

		const product = (yield request(server).put('/product/0132350886').send({ price: 29.99 }).expect(200).end()).body;

		product.price.should.equal(29.99);
	});

	it('search products by isbn, name, description', function*(){
		let new_products = [
			{ id: '0132350886', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 },
			{ id: '0552565970', name: 'Wonder', description: "'My name is August. I won't describe what I look like. Whatever you're thinking, it's probably worse.'", price: 7.30, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/5525/9780552565974.jpg', stock: 10, deliveryDays: 5 },
			{ id: '0008164657', name: 'Bad Dad', description: "In yet another dazzling David Walliams classic, Bad Dad is a fast and furious, heart-warming.", price: 9.17, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0081/9780008164652.jpg', stock: 10, deliveryDays: 5 },
			{ id: '1847399304', name: 'The Bro Code', description: "THE BRO CODE provides men with all the rules they need to know in order to become a 'bro' and behave properly among other bros.", price: 8.01, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9781/8473/9781847399304.jpg', stock: 10, deliveryDays: 5 },
			{ id: '0099519852', name: 'The Talent Code : Greatness isn\'t born. It\'s grown', description: "'Talent. You've either got it or you haven't.' Not true, actually.", price: 9.59, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0995/9780099519850.jpg', stock: 10, deliveryDays: 5 }
		];

		yield request(server).post('/product').send(new_products[0]).expect(201).end();
		yield request(server).post('/product').send(new_products[1]).expect(201).end();
		yield request(server).post('/product').send(new_products[2]).expect(201).end();
		yield request(server).post('/product').send(new_products[3]).expect(201).end();
		yield request(server).post('/product').send(new_products[4]).expect(201).end();

		let products = (yield request(server).get('/product/search/code').expect(200).end()).body;
		products.should.have.lengthOf(3);

		products = (yield request(server).get('/product/search/august').expect(200).end()).body;
		products.should.have.lengthOf(1);

		products = (yield request(server).get('/product/search/a').expect(200).end()).body;
		products.should.have.lengthOf(5);

		products = (yield request(server).get('/product/search/00').expect(200).end()).body;
		products.should.have.lengthOf(2);
	});

});