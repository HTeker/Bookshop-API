//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai'),
	chaiHttp = require('chai-http'),
	server = require('../server'),
	should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Products', () => {
  describe('Get all products', () => {
      it('it should GET all the products', (done) => {
        chai.request(server)
            .get('/product')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
});