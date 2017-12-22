require('co-mocha');

process.env.NODE_ENV = 'test';

let chai = require('chai'),
	should = chai.should(),
	server = require('../server'),
	request = require('co-supertest')
	db = require('../data/db')
	seeder = require('../data/seeder')
	User = require('../models/user');

describe('Auth', () => {

	beforeEach(function(done){
		db.sync({force: true}).then(function(){
			done();
		});
	});

	it('register a new user', function*(){
		yield request(server).post('/user').send({ name: 'User #', email: 'email@example.com', password: '1234Pass5678'}).expect(201).end();
		yield request(server).post('/user').send({ name: 'User #2', email: 'email2@example.com', password: '1234Pass5678'}).expect(201).end();
		yield request(server).post('/user').send({ name: 'User #3', email: 'email3@example.com', password: '1234Pass5678'}).expect(201).end();
		let users = (yield request(server).get('/user').expect(200).end()).body;
		users.should.have.lengthOf(3);
	});

});