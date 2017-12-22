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
				{name: 'Halil', email: 'halil@example.com', password: '1234Pass5678'},
				{name: 'Teker', email: 'teker@example.com', password: '1234Pass5678'},
				{name: 'Ibrahim', email: 'ibrahim@example.com', password: '1234Pass5678'},
				{name: 'Jack', email: 'jack@example.com', password: '1234Pass5678'},
				{name: 'Michael', email: 'michael@example.com', password: '1234Pass5678'}
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
		yield request(server).post('/user').send({ name: 'User #', email: 'email@example.com', password: '1234Pass5678'}).expect(201).end();
		let users = (yield request(server).get('/user').expect(200).end()).body;
		users.should.have.lengthOf(6);
	});

	it('get a user by email', function*(){
		const token = (yield request(server).post('/login').send({email: 'ibrahim@example.com', password: '1234Pass5678'}).expect(200).end()).body;
		let user = (yield request(server).get('/user/ibrahim@example.com').set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		delete user.createdAt;
        delete user.updatedAt;
        delete user.password;
		user.should.deep.equal({name: 'Ibrahim', email: 'ibrahim@example.com'});
	});

	it('delete a user by email', function*(){
		const token = (yield request(server).post('/login').send({email: 'halil@example.com', password: '1234Pass5678'}).expect(200).end()).body;
		yield request(server).delete('/user/halil@example.com').set('Authorization', 'Bearer ' + token).expect(200).end();
		let users = (yield request(server).get('/user').expect(200).end()).body;
		users.should.have.lengthOf(4);
	});

	it('update a user by email', function*(){
		const token = (yield request(server).post('/login').send({email: 'jack@example.com', password: '1234Pass5678'}).expect(200).end()).body;
		const user = (yield request(server).put('/user/jack@example.com').send({ name: 'Updated User' }).set('Authorization', 'Bearer ' + token).expect(200).end()).body;
		delete user.createdAt;
        delete user.updatedAt;
        delete user.password;
		user.should.deep.equal({ name: 'Updated User', email: 'jack@example.com' });
	});

	it('search users by name and email', function*(){
		let users = (yield request(server).get('/user/search/example').expect(200).end()).body;
		users.should.have.lengthOf(5);

		users = (yield request(server).get('/user/search/i').expect(200).end()).body;
		users.should.have.lengthOf(3);

		users = (yield request(server).get('/user/search/halil').expect(200).end()).body;
		users.should.have.lengthOf(1);
	});

});