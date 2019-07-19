'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const config = require('../../config/test')
const ArticleModel = require('../article/article.model');

const connection = require('../../app');
const requester = chai.request(connection).keepOpen()

describe('[ARTICLE]', function () {
  this.timeout(10000)
  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${config.token}`
  };

  let body, query = {};
  let idArticle, idJournal = '';

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
        ArticleModel.findOne({}).order({creationDate: -1})
          .exec(function (err, doc) {
            idArticle = doc._id;
            done();
          });
      });
  });

  it('POST -> create journal', function (done) {
    body = {
      title: 'TEST JOURNAL',
      abstract: 'My Test Journal For Fun',
      published: true,
      tags: ['Test']
    };
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(201);
        expect(res.body).to.contain.key('success', 'journal');
        expect(res.body.success).to.be.true;
        expect(res.body.journal).to.contain.key('_id', 'creationDate', 'abstract',
          'published', 'status', 'doi', 'slug', 'color_1', 'color_2', 'users',
          'tags', 'content');
        idJournal = res.body.journal._id;
        done();
    })
  });

  it('POST -> create journal with missing parameters', function (done) {
    body = {
      title: 'TEST JOURNAL',
      published: true,
      tags: ['Test']
    };
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(422);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters;');
        done();
    })
  });

  it('GET -> get all journals', function (done) {
    requester.get('/api/journals')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('journals');
        done();
    })
  });

  it('GET -> get journal by id', function (done) {
    requester.get('/api/journals/' + idJournal)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('journals');
        done();
      })
  });

  it('GET -> get journal with wrong id', function (done) {
    requester.get('/api/journals/23456789876543a')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(404);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Journals not found.');
        done();
      })
  });

  it('POST -> add article to a journal', function (done) {
    body = { id_article: idArticle };
    requester.post(`/api/journals/${idJournal}/article`)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it('POST -> add article to a journal with missing parameters', function (done) {
    body = {};
    requester.post(`/api/journals/${idJournal}/article`)
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

  it('POST -> add article to a journal with unknown journalId', function (done) {
    body = { id_article: idArticle };
    requester.post(`/api/journals/${idArticle}/article`)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(404);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Journals not found.');
        done();
      })
  });

  it('PUT -> update a journal', function (done) {
    body = {
      title: 'TEST JOURNAL',
      abstract: 'My Test Journal For Fun',
      published: true
    };
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body.journal).to.contain.key('_id', 'creationDate', 'abstract',
          'published', 'status', 'doi', 'slug', 'color_1', 'color_2', 'users',
          'tags', 'content');
        done();
    })
  });

  it('PUT -> update a journal with missing parameters', function (done) {
    body = {
      title: 'TEST JOURNAL',
      published: true
    };
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(422);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters.')
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });

  it(' -> ', function (done) {
    requester.post('/api/journals')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status();
        expect(res.body).to.contain.key('');
        done();
    })
  });
});
