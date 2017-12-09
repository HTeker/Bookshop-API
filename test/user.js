require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	User = require('../models/user');

describe('User', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			User.bulkCreate([
				{name: 'Halil', email: 'halil@example.com', password: '12345678'},
				{name: 'Teker', email: 'teker@example.com', password: '12345678'},
				{name: 'Ibrahim', email: 'ibrahim@example.com', password: '12345678'},
				{name: 'Jack', email: 'jack@example.com', password: '12345678'},
				{name: 'Michael', email: 'michael@example.com', password: '12345678'}
			]).then((users) => {
				done();
			});
		});
	});

	it('get all users', function*(){
		let users = (yield request(server).get('/user').expect(200).end()).body;
		users.should.be.a('array');
		users.should.have.lengthOf(5);
	});

	it('create a user', function*(){
		yield request(server).post('/user').send({ name: 'User #', email: 'email@example.com', password: '123456'}).expect(201).end();
		let users = (yield request(server).get('/user').expect(200).end()).body;
		users.should.have.lengthOf(6);
	});

	it('get a user by id', function*(){
		let user = (yield request(server).get('/user/3').expect(200).end()).body;
		delete user.createdAt;
        delete user.updatedAt;
		user.should.deep.equal({id: 3, name: 'Ibrahim', email: 'ibrahim@example.com', password: '12345678'});
	});

	it('delete a user by id', function*(){
		yield request(server).delete('/user/1').expect(200).end();
		let users = (yield request(server).get('/user').expect(200).end()).body;
		users.should.have.lengthOf(4);
	});

});