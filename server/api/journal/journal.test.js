'use strict';

const shortid = require("shortid");

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const config = require('../../config/test');
const UserModel = require('../user/user.model');
const ArticleModel = require('../article/article.model');

const connection = require('../../app');
const requester = chai.request(connection).keepOpen()

describe('[JOURNAL]', function () {
  this.timeout(10000)
  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${config.token}`
  };

  let body, query = {};
  let idArticle, idJournal, userId = '';

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
          .exec(function (err, doc) {
            idArticle = doc._id;
          });
        UserModel.findOne({}).exec(function (err, doc) {
          userId = doc._id;
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
        expect(res.body.message).to.be.equal('Missing parameters.');
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
        expect(res.body).to.contain.key('__v', '_id', 'abstract', 'color_1', 'color_2',
          'content', 'creationDate', 'deleted', 'doi', 'published', 'slug', 'status',
          'tags', 'title', 'users');
        done();
      })
  });

  it('GET -> get journal with wrong id', function (done) {
    requester.get('/api/journals/54759eb3c090d83494e2d804')
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
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success');
        expect(res.body.success).to.be.true;
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
      title: 'TESTJOURNAL',
      abstract: 'My Test Journal For Fun',
      published: true
    };
    requester.put(`/api/journals/${idJournal}`)
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
    requester.put(`/api/journals/${idJournal}`)
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

  it('PUT -> invite associate editor', function (done) {
    body = {
      associate_editor: {
        email: 'michael@example.com'
      }
    };
    requester.put(`/api/journals/${idJournal}/addAssociateEditor`)
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

  it('PUT -> invite associate editor with missing parameter', function (done) {
    body = {}
    requester.put(`/api/journals/${idJournal}/addAssociateEditor`)
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

  it('GET -> journal\'s users', function (done) {
    requester.get(`/api/journals/${idJournal}/users/`)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success', 'users');
        expect(res.body.success).to.be.true;
        expect(res.body.users).to.be.an.instanceOf(Array);
        expect(res.body.users[0]).to.contain.key('id_article', 'id_user', '_id', 'right')
        done();
    })
  });

  it('GET -> journal\'s associate_editor', function (done) {
    requester.get(`/api/journals/${idJournal}/users/associate_editor`)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success', 'users');
        expect(res.body.success).to.be.true;
        expect(res.body.users).to.be.an.instanceOf(Array);
        expect(res.body.users[0]).to.contain.key('id_article', 'id_user', '_id', 'right')
        done();
      })
  });

  it('GET -> journal\'s editor', function (done) {
    requester.get(`/api/journals/${idJournal}/users/editor`)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success', 'users');
        expect(res.body.success).to.be.true;
        expect(res.body.users).to.be.an.instanceOf(Array);
        expect(res.body.users[0]).to.contain.key('id_article', 'id_user', '_id', 'right')
        done();
      })
  });

  it('GET -> journal\'s users', function (done) {
    requester.get(`/api/journals/${idJournal}/users/user`)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success', 'users');
        expect(res.body.success).to.be.true;
        expect(res.body.users).to.be.an.instanceOf(Array);
        expect(res.body.users).to.be.empty;
        done();
      })
  });

  it('PATCH -> set article to published', function (done) {
    requester.patch(`/api/journals/${idJournal}/article/${idArticle}`)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success');
        expect(res.body.success).to.be.true;
        done();
    })
  });

  it('POST -> invite new user to follow journal', function (done) {
    let shortId = shortid.generate();
    while (shortId.indexOf('-') >= 0)
      shortId = shortid.generate();
    let link = shortId;
    let inviteTo = 'user@test.fr';
    let message = "toto";
    body = {
      link: link,
      msg: message,
      to: inviteTo,
      name: userId
    };
    requester.post(`/api/journals/${idJournal}/invite/user`)
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

  it('POST -> invite new associate editor to follow journal', function (done) {
    let shortId = shortid.generate();
    while (shortId.indexOf('-') >= 0)
      shortId = shortid.generate();
    let link = shortId;
    let inviteTo = 'ae@test.fr';
    let message = "toto";
    body = {
      link: link,
      msg: message,
      to: inviteTo,
      name: userId
    };
    requester.post(`/api/journals/${idJournal}/invite/associate_editor`)
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

  it('POST -> invite new user with missing parameter', function (done) {
    let inviteTo = 'user@test.fr';
    let message = "toto";
    body = {
      msg: message,
      to: inviteTo,
      name: userId
    };
    requester.post(`/api/journals/${idJournal}/invite/user`)
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

  it('GET -> my followed journals', function (done) {
    requester.get('/api/journals/followed')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success', 'journals');
        expect(res.body.success).to.be.true;
        expect(res.body.journals).to.be.an.instanceOf(Array);
        done();
    })
  });

  it('POST -> try to unfollow your journal', function (done) {
    requester.post('/api/journals/' + idJournal + '/follow')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(403);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Editor and Associate Editor can not unfollow a journal');
        done();
    })
  });

  it('DELETE -> remove journal', function (done) {
    requester.delete('/api/journals/' + idJournal + '/removeJournal')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(204);
        expect(res.body).to.be.empty;
        done();
    })
  });

  it('PATCH -> update tags', function (done) {
    body = {
      tags: ['Dev', 'test', 'unit']
    };
    requester.patch('/api/journals/' + idJournal + '/tags')
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

  it('PATCH -> update tags', function (done) {
    body = {};
    requester.patch('/api/journals/' + idJournal + '/tags')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters.');
        done();
      });
  });
});
