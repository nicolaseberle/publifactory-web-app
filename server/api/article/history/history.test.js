'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid').v4();

const config = require('../../../config/test');
const ArticleModel = require('../../article/article.model');

const connection = require('../../../app');
const requester = chai.request(connection).keepOpen()

describe('[HISTORY]', function () {
  this.timeout(10000)
  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${config.token}`
  };

  let body, query = {};
  let idArticle = '';

  before('Retrieve token', function (done) {
    const user = {
      email: config.email,
      password: config.password
    };
    requester.post('/api/auth/local')
      .set({'Content-Type': 'application/json'})
      .send(user)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);

        //Check body params
        expect(res.body).to.contain.key("token");
        //Write token for other tests
        if (res.body.token !== undefined) {
          headers["authorization"] = 'Bearer ' + res.body.token;
          config.token = res.body.token;
          fs.unlinkSync(path.join(__dirname, '../../../config/test.json'));
          fs.writeFileSync(path.join(__dirname, '../../../config/test.json'), JSON.stringify(config));
        }
        ArticleModel.findOne({}).sort({creationDate: -1})
          .exec(function (err, doc) {
            idArticle = doc._id;
            done();
          });
      });
  });

  it('GET -> get history of every instructions on an article', function (done) {
    requester.get('/api/history/' + idArticle)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success', 'history');
        expect(res.body.success).to.be.true;
        expect(res.body.history).to.be.an.instanceOf(Array);
        expect(res.body.history).to.be.empty;
        done();
      });
  });

  it('POST -> insert instruction in history', function (done) {
    body = {
      instruction: 'NEW_REVIEWER'
    };
    requester.post('/api/history/' + idArticle)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(201);
        expect(res.body).to.contain.key('success');
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it('POST -> insert nonexistent instruction in history', function (done) {
    body = {
      instruction: 'MY_OWN_INSTRUCTION'
    };
    requester.post('/api/history/' + idArticle)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(404);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Unknown instruction.');
        done();
      });
  });

  it('POST -> insert instruction in history with missing parameter', function (done) {
    body = {};
    requester.post('/api/history/' + idArticle)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(422);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters.');
        done();
      });
  });

  it('GET -> get history of every instructions on an article', function (done) {
    requester.get('/api/history/' + idArticle)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success', 'history');
        expect(res.body.success).to.be.true;
        expect(res.body.history).to.be.an.instanceOf(Array);
        done();
      });
  });
});
