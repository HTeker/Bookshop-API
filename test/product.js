require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	Product = require('../models/product');

var token;

describe('Product', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			User.bulkCreate([
                {name: 'Halil', email: 'halil@example.com', isAdmin: true, password: '1234Pass5678'}
            ]).then((users) => {
            	Product.bulkCreate([
					{ id: '0132350886', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 },
					{ id: '0552565970', name: 'Wonder', description: "'My name is August. I won't describe what I look like. Whatever you're thinking, it's probably worse.'", price: 7.30, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/5525/9780552565974.jpg', stock: 10, deliveryDays: 5 },
					{ id: '0008164657', name: 'Bad Dad', description: "In yet another dazzling David Walliams classic, Bad Dad is a fast and furious, heart-warming.", price: 9.17, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0081/9780008164652.jpg', stock: 10, deliveryDays: 5 },
					{ id: '1847399304', name: 'The Bro Code', description: "THE BRO CODE provides men with all the rules they need to know in order to become a 'bro' and behave properly among other bros.", price: 8.01, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9781/8473/9781847399304.jpg', stock: 10, deliveryDays: 5 },
					{ id: '0099519852', name: 'The Talent Code : Greatness isn\'t born. It\'s grown', description: "'Talent. You've either got it or you haven't.' Not true, actually.", price: 9.59, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0995/9780099519850.jpg', stock: 10, deliveryDays: 5 }
				]).then((products) => {
					done();
				});
            });
		});
	});

	it('get user token', function*(){
		token = (yield request(server).post('/login').send({ email: 'halil@example.com', password: '1234Pass5678'}).expect(200).end()).body.token;
	});

	it('get all products', function*(){
		let products = (yield request(server).get('/product').expect(200).end()).body;
		products.should.be.a('array');
		products.should.have.lengthOf(5);
	});

	it('create a product', function*(){
		let new_product = { id: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 };
		yield request(server).post('/product').send(new_product).set('Authorization', 'Bearer ' + token).expect(201).end();
		let products = (yield request(server).get('/product').expect(200).end()).body;
		products.should.have.lengthOf(6);
	});

	it('get a product by id', function*(){
		let product = (yield request(server).get('/product/1847399304').expect(200).end()).body;
		delete product.createdAt;
        delete product.updatedAt;
		product.should.deep.equal({ id: '1847399304', name: 'The Bro Code', description: "THE BRO CODE provides men with all the rules they need to know in order to become a 'bro' and behave properly among other bros.", price: 8.01, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9781/8473/9781847399304.jpg', stock: 10, deliveryDays: 5 });
	});

	it('delete a product by id', function*(){
		yield request(server).delete('/product/0008164657').set('Authorization', 'Bearer ' + token).expect(200).end();
		let products = (yield request(server).get('/product').expect(200).end()).body;
		products.should.have.lengthOf(4);
	});

	it('update a product by id', function*(){
		const product = (yield request(server).put('/product/0552565970').send({ description: "This is the new description", price: 29.99 }).set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		delete product.createdAt;
        delete product.updatedAt;
		product.should.deep.equal({ id: '0552565970', name: 'Wonder', description: "This is the new description", price: 29.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/5525/9780552565974.jpg', stock: 10, deliveryDays: 5 });
	});

	it('search products by isbn, name, description', function*(){
		let products = (yield request(server).get('/product/search/code').expect(200).end()).body;
		products.should.have.lengthOf(3);

		products = (yield request(server).get('/product/search/august').expect(200).end()).body;
		products.should.have.lengthOf(1);

		products = (yield request(server).get('/product/search/a').expect(200).end()).body;
		products.should.have.lengthOf(5);

		products = (yield request(server).get('/product/search/00').expect(200).end()).body;
		products.should.have.lengthOf(2);
	});

	it('add one category to a product', function*(){
		let category = (yield request(server).post('/category').send({ name: 'Programming'}).set('Authorization', 'Bearer ' + token).expect(201).end()).body;
		yield request(server).post('/product/0132350886/category').send(category).set('Authorization', 'Bearer ' + token).expect(201).end();

		let categories = (yield request(server).get('/product/0132350886/category').expect(200).end()).body;
		categories.should.have.lengthOf(1);
	});

	it('get all categories of a product', function*(){
		let categories = [];
		categories.push((yield request(server).post('/category').send({ name: 'Programming'}).set('Authorization', 'Bearer ' + token).expect(201).end()).body);
		categories.push((yield request(server).post('/category').send({ name: 'Coding'}).set('Authorization', 'Bearer ' + token).expect(201).end()).body);
		categories.push((yield request(server).post('/category').send({ name: 'Education'}).set('Authorization', 'Bearer ' + token).expect(201).end()).body);

		yield request(server).post('/product/0132350886/category').send(categories).set('Authorization', 'Bearer ' + token).expect(201).end();

		let returnedCategories = (yield request(server).get('/product/0132350886/category').expect(200).end()).body;
		returnedCategories.should.have.lengthOf(3);
	});

	it('delete one category from a product', function*(){
		let category = (yield request(server).post('/category').send({ name: 'Programming'}).set('Authorization', 'Bearer ' + token).expect(201).end()).body;
		yield request(server).post('/product/0132350886/category').send(category).set('Authorization', 'Bearer ' + token).expect(201).end();

		let categories = (yield request(server).get('/product/0132350886/category').expect(200).end()).body;
		categories.should.have.lengthOf(1);

		yield request(server).delete('/product/0132350886/category').send(category).set('Authorization', 'Bearer ' + token).expect(200).end();

		let newCategories = (yield request(server).get('/product/0132350886/category').expect(200).end()).body;
		newCategories.should.have.lengthOf(0);
	});

	it('delete multiple categories from a product', function*(){
		let categories = [];
		categories.push((yield request(server).post('/category').send({ name: 'Programming'}).set('Authorization', 'Bearer ' + token).expect(201).end()).body);
		categories.push((yield request(server).post('/category').send({ name: 'Coding'}).set('Authorization', 'Bearer ' + token).expect(201).end()).body);
		categories.push((yield request(server).post('/category').send({ name: 'Education'}).set('Authorization', 'Bearer ' + token).expect(201).end()).body);

		yield request(server).post('/product/0132350886/category').send(categories).set('Authorization', 'Bearer ' + token).expect(201).end();

		let returnedCategories = (yield request(server).get('/product/0132350886/category').expect(200).end()).body;
		returnedCategories.should.have.lengthOf(3);

		yield request(server).delete('/product/0132350886/category').send(categories).set('Authorization', 'Bearer ' + token).expect(200).end();

		let newCategories = (yield request(server).get('/product/0132350886/category').expect(200).end()).body;
		newCategories.should.have.lengthOf(0);
	});

});