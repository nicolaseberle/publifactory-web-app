'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid')

const config = require('../../config/test')
const UserModel = require('../user/user.model')

const connection = require('../../app');
const requester = chai.request(connection).keepOpen()

describe('[ARTICLE]', function () {
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
          fs.unlinkSync(path.join(__dirname, '../../config/test.json'));
          fs.writeFileSync(path.join(__dirname, '../../config/test.json'), JSON.stringify(config));
        }
        done();
      });
  });

  it('POST -> create article', function (done) {
    body = {
      title: 'My Test',
      content: 'TestTest',
      abstract: 'An abstract for test',
      status: 'Draft',
      published: false,
      arr_content: [{
        title: 'Title Section',
        block: [[{
          type: 'Text',
          content: 'HELLO SECTION',
          uuid: uuidv4.v4()
        }]]
      }]
    };
    requester.post('/api/articles')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(201);
        idArticle = res.body;
        done();
      });
  });

  it('POST -> create article with missing parameters', function (done) {
    body = {
      title: 'My Test',
      content: 'TestTest',
      abstract: 'An abstract for test',
      status: 'Draft',
      published: false,
    };
    requester.post('/api/articles')
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

  it('POST -> create version', function (done) {
    body = {
      name: 'My test version',
      title: 'My Test',
      abstract: 'An abstract for test',
      arr_content: [{
        title: 'Title Section',
        block: [[{
          type: 'Text',
          content: 'HELLO SECTION',
          uuid: uuidv4.v4()
        }]]
      }]
    };
    requester.post('/api/articles/' + idArticle + '/version')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        console.log(res.body)
        expect(res).to.have.status(201);
        expect(res.body).to.contain.key('success');
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it('POST -> create version with missing parameters', function (done) {
    body = {
      name: 'My test version',
      title: 'My Test',
      abstract: 'An abstract for test'
    };
    requester.post('/api/articles/' + idArticle + '/version')
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

  it('GET -> get articles', function (done) {
    requester.get('/api/articles')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('articles', 'limit', 'page', 'pages', 'total');
        done();
      });
  });

  it('GET -> get articles with query parameters', function (done) {
    query = {
      page: 1,
      limit: 10
    };
    requester.get('/api/articles')
      .set(headers)
      .query(query)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('articles', 'limit', 'page', 'pages', 'total');
        done();
      });
  });

  it('GET -> get my articles', function (done) {
    requester.get('/api/articles/mine')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('articles', 'limit', 'page', 'pages', 'total');
        done();
      });
  });

  it('GET -> get my articles with query parameters', function (done) {
    query = {
      page: 1,
      limit: 10
    };
    requester.get('/api/articles/mine')
      .set(headers)
      .query(query)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('articles', 'limit', 'page', 'pages', 'total');
        done();
      });
  });

  it('PUT -> update article', function (done) {
    body = {
      title: 'My changed test',
      content: 'TestTest',
      abstract: 'An abstract for test',
      status: 'Draft',
      published: false,
      arr_content: [{
        title: 'Title Section',
        block: [[{
          type: 'Text',
          content: 'HELLO SECTION',
          uuid: uuidv4.v4()
        }]]
      }],
      tags: ['test']
    };
    requester.put('/api/articles/' + idArticle)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('title');
        done();
      });
  });

  it('PUT -> update article with missing parameters', function (done) {
    body = {
      title: 'My changed test',
      content: 'TestTest',
      abstract: 'An abstract for test',
      status: 'Draft',
      published: false,
      tags: ['test']
    };
    requester.put('/api/articles/' + idArticle)
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

  it('PUT -> add author to article', function (done) {
    body = {
      author: {
        email: 'michael@example.com',
        rank: 2,
        role: 'Author'
      }
    };
    requester.put('/api/articles/' + idArticle + '/addAuthors')
      .set(headers)
      .send(body)
      .end((req, res) => {
        console.log(res.body)
        expect(res).to.exist;
        expect(res).to.have.status(201);
        expect(res.body).to.contain.key('success');
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it('PUT -> add author to article with missing parameter', function (done) {
    body = {};
    requester.put('/api/articles/' + idArticle + '/addAuthors')
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

  it('PATCH -> update authors rights from article', function (done) {
    body = {
      newAuthors: [{
        email: config.email,
        rank: 2,
        role: 'Lead'
      }, {
        email: 'michael@example.com',
        rank: 2,
        role: 'Senior'
      }]
    };
    requester.patch('/api/articles/' + idArticle + '/authorRights')
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

  it('PATCH -> update authors rights from article with missing parameter', function (done) {
    body = {};
    requester.patch('/api/articles/' + idArticle + '/authorRights')
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

  it('DELETE -> remove author from an article', function (done) {
    return new Promise(async resolve => {
      const user = await UserModel.findOne({email: 'michael@example.com'})
      console.log(user)
      body = {
        authorId: user._id
      };
      requester.put('/api/articles/' + idArticle + '/removeAuthor')
        .set(headers)
        .send(body)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
          resolve()
        });
    }).then(done)
  });

  it('DELETE -> remove author from an article with missing parameters', function (done) {
    body = {};
    requester.put('/api/articles/' + idArticle + '/removeAuthor')
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

  it('PATCH -> change status', function (done) {
    requester.patch('/api/articles/' + idArticle + '/submit')
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

  it('PATCH -> change status with unknown status', function (done) {
    requester.patch('/api/articles/' + idArticle + '/myStatusWhichDoesntExist')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(404);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('This route does not exist.');
        done();
      });
  });

  it('DELETE -> delete article', function (done) {
    requester.delete('/api/articles/' + idArticle)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(204);
        expect(res.body).to.be.empty;
        done();
      });
  });
});
