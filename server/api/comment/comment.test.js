'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid').v4();

const config = require('../../config/test');
const ArticleModel = require('../article/article.model');

const connection = require('../../app');
const requester = chai.request(connection).keepOpen()

describe('[COMMENTS]', function () {
  this.timeout(10000)
  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${config.token}`
  };

  let body, query = {};
  let idArticle, uuidComment = '';

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
        ArticleModel.findOne({}).sort({creationDate: -1})
          .exec(function(err, doc) {
            idArticle = doc._id;
            done();
        });
      });
  });

  it('POST -> create a comment', function (done) {
    body = {
      uuidComment: uuidv4,
      commentFlag: false,
      anonymousFlag: false,
      content: 'My comment is an unique test.',
      reviewRequest: 'None'
    };
    requester.post('/api/comments/' + idArticle)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(201);
        expect(res.body).to.contain.key('creationDate', 'uuidComment', 'userId',
          'anonymousFlag', 'commentFlag', 'content', 'reviewRequest', 'scores',
          'childComment');
        uuidComment = res.body.uuidComment;
        done();
      })
  });

  it('POST -> create a comment with missing parameters', function (done) {
    body = {
      uuidComment: uuidv4,
      commentFlag: false,
      anonymousFlag: false,
      reviewRequest: 'None'
    };
    requester.post('/api/comments/' + idArticle)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(422);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters.');
        done();
      })
  });

  it('POST -> create comment\'s answer', function (done) {
    body = {
      reviewRequest: 'None',
      uuidComment: uuidv4,
      content: 'This is a test answer.'
    };
    requester.post(`/api/comments/${idArticle}/${uuidComment}/answer`)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(201);
        expect(res.body).to.contain.key('success');
        expect(res.body.success).to.be.true;
        done();
      })
  });

  it('POST -> create comment\'s answer with missing parameters', function (done) {
    body = {
      uuidComment: uuidv4,
      content: 'This is a test answer.'
    };
    requester.post(`/api/comments/${idArticle}/${uuidComment}/answer`)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(422);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters.');
        done();
      })
  });

  it('GET -> comment from an article', function (done) {
    requester.get(`/api/comments/${idArticle}/`)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body[0]).to.contain.key('creationDate', 'uuidComment', 'userId',
          'anonymousFlag', 'commentFlag', 'content', 'reviewRequest', 'scores',
          'childComment');
        done();
      })
  });

  it('GET -> comment from an article with query parameters', function (done) {
    query = {
      page: 1,
      limit: 10
    };
    requester.get(`/api/comments/${idArticle}/`)
      .set(headers)
      .query(query)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body[0]).to.contain.key('creationDate', 'uuidComment', 'userId',
          'anonymousFlag', 'commentFlag', 'content', 'reviewRequest', 'scores',
          'childComment');
        done();
      })
  });

  it('GET -> specific comment from an article', function (done) {
    requester.get(`/api/comments/${idArticle}/${uuidComment}`)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an.instanceOf(Array);
        expect(res.body[0]).to.contain.key('creationDate', 'uuidComment', 'userId',
          'anonymousFlag', 'commentFlag', 'content', 'reviewRequest', 'scores',
          'childComment');
        done();
      })
  });

  it('GET -> specific comment from an article with query parameters', function (done) {
    query = {
      page: 1,
      limit: 10
    };
    requester.get(`/api/comments/${idArticle}/${uuidComment}`)
      .set(headers)
      .query(query)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an.instanceOf(Array);
        expect(res.body[0]).to.contain.key('creationDate', 'uuidComment', 'userId',
          'anonymousFlag', 'commentFlag', 'content', 'reviewRequest', 'scores',
          'childComment');
        done();
      })
  });

  it('GET -> nonexistent comment', function (done) {
    requester.get(`/api/comments/${idArticle}/${uuidv4}`)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(404);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Comments not found.');
        done();
      })
  });

  it('PUT -> update score vote on comments', function (done) {
    body = {
      upvote: 2,
      downvote: 1
    };
    requester.put(`/api/comments/${idArticle}/${uuidComment}`)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('creationDate', 'uuidComment', 'userId',
          'anonymousFlag', 'commentFlag', 'content', 'reviewRequest', 'scores',
          'childComment');
        done();
      })
  });

  it('PUT -> update score vote with missing parameters', function (done) {
    body = {}
    requester.put(`/api/comments/${idArticle}/${uuidComment}`)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(422);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters.');
        done();
      })
  });

  it('PUT -> update comment', function (done) {
    body = {
      content: 'My new content after update'
    };
    requester.put(`/api/comments/${idArticle}/${uuidComment}/content`)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success');
        expect(res.body.success).to.be.true;
        done();
      })
  });

  it('PUT -> update comment with missing content', function (done) {
    body = {};
    requester.put(`/api/comments/${idArticle}/${uuidComment}/content`)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(422);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters.');
        done();
      })
  });
});
