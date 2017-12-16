require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	User = require('../models/user');


describe('Wishlist', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			User.create({name: 'Halil', email: 'halil@example.com', password: '12345678'}).then((user) => {
				Wishlist.bulkCreate([
					{ name: 'Wishlist #1' },
					{ name: 'Wishlist #2' },
					{ name: 'Wishlist #3' },
					{ name: 'Wishlist #4' },
					{ name: 'Wishlist #5' }
				]).then(wishlists => {
					user.addWishlists(wishlists).then(
						createdWishlists => {
							done();
						}
					);
				});
			});
		});
	});

	it('get all wishlists of an user by id', function*(){
		let wishlists = (yield request(server).get('/user/1/wishlist').expect(200).end()).body;
		wishlists.should.be.a('array');
		wishlists.should.have.lengthOf(5);
	});

	it('create a wishlist for an user by id', function*(){
		yield request(server).post('/user/1/wishlist').send({ name: 'New Wishlist' }).expect(201).end();
		let wishlists = (yield request(server).get('/user/1/wishlist').expect(200).end()).body;
        wishlists.should.have.lengthOf(6);
	});

	it('get a wishlist from an user by id', function*(){
		let wishlist = (yield request(server).get('/user/1/wishlist/3').expect(200).end()).body;
		delete wishlist.createdAt;
        delete wishlist.updatedAt;
		wishlist.should.deep.equal({id: 3, name: 'Wishlist #3', UserId: 1});
	});

	it('delete a wishlist from an user by id', function*(){
		yield request(server).delete('/user/1/wishlist/3').expect(200).end();
		let wishlists = (yield request(server).get('/user/1/wishlist').expect(200).end()).body;
		wishlists.should.have.lengthOf(4);
	});

	it('update a wishlist from an user by id', function*(){
		const wishlist = (yield request(server).put('/user/1/wishlist/3').send({ name: 'Updated Wishlist' }).expect(200).end()).body;
		delete wishlist.createdAt;
        delete wishlist.updatedAt;
		wishlist.should.deep.equal({ id: 3, name: 'Updated Wishlist', UserId: 1 });
	});

	it('search wishlists by name', function*(){
		let wishlists = (yield request(server).get('/user/1/wishlist/search/wishlist').expect(200).end()).body;
		wishlists.should.have.lengthOf(5);

		wishlists = (yield request(server).get('/user/1/wishlist/search/3').expect(200).end()).body;
		wishlists.should.have.lengthOf(1);
	});

	it('add one product to a wishlist for an user by id', function*(){
		let product = (yield request(server).post('/product').send({ id: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).expect(201).end()).body;
		yield request(server).post('/user/1/wishlist/3/product').send(product).expect(201).end();

		let products = (yield request(server).get('/user/1/wishlist/3/product').expect(200).end()).body;
		products.should.have.lengthOf(1);
	});

	it('get all products of a wishlist of an user by id', function*(){
		for(var i = 0; i < 5; i++){
			let product = (yield request(server).post('/product').send({ id: i.toString(), name: 'Name #' + i, description: 'Description #' + i, price: 19.99, imgUrl: 'http://example.com', stock: 10, deliveryDays: 5 }).expect(201).end()).body;
			yield request(server).post('/user/1/wishlist/3/product').send(product).expect(201).end();
		}

		let products = (yield request(server).get('/user/1/wishlist/3/product').expect(200).end()).body;
		products.should.have.lengthOf(5);
	});

	it('delete one product from a wishlist of an user by id', function*(){
		let product = (yield request(server).post('/product').send({ id: '0132350882', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).expect(201).end()).body;
		yield request(server).post('/user/1/wishlist/3/product').send(product).expect(201).end();

		let products = (yield request(server).get('/user/1/wishlist/3/product').expect(200).end()).body;
		products.should.have.lengthOf(1);

		yield request(server).delete('/user/1/wishlist/3/product').send(product).expect(200).end();

		let newProducts = (yield request(server).get('/user/1/wishlist/3/product').expect(200).end()).body;
		newProducts.should.have.lengthOf(0);
	});

	it('delete multiple products from a category', function*(){
		let products = [];
		products.push((yield request(server).post('/product').send({ id: '0132350886', name: 'Clean Code : A Handbook of Agile Software Craftsmanship', description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 19.99, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1323/9780132350884.jpg', stock: 10, deliveryDays: 5 }).expect(201).end()).body);
		products.push((yield request(server).post('/product').send({ id: '0552565970', name: 'Wonder', description: "'My name is August. I won't describe what I look like. Whatever you're thinking, it's probably worse.'", price: 7.30, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/5525/9780552565974.jpg', stock: 10, deliveryDays: 5 }).expect(201).end()).body);
		products.push((yield request(server).post('/product').send({ id: '0008164657', name: 'Bad Dad', description: "In yet another dazzling David Walliams classic, Bad Dad is a fast and furious, heart-warming.", price: 9.17, imgUrl: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/0081/9780008164652.jpg', stock: 10, deliveryDays: 5 }).expect(201).end()).body);

		yield request(server).post('/user/1/wishlist/3/product').send(products).expect(201).end();

		let returnedProducts = (yield request(server).get('/user/1/wishlist/3/product').expect(200).end()).body;
		returnedProducts.should.have.lengthOf(3);

		yield request(server).delete('/user/1/wishlist/3/product').send(products).expect(200).end();

		let newProducts = (yield request(server).get('/user/1/wishlist/3/product').expect(200).end()).body;
		newProducts.should.have.lengthOf(0);
	});

});