'use strict';

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
const JournalModel = require('../journal/journal.model');

const connection = require('../../app');
const requester = chai.request(connection).keepOpen();

describe('[ROLES]', function () {
  this.timeout(10000)
  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${config.token}`
  };

  let userId = '';

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
        UserModel.findOne({}).exec(function (err, doc) {
          userId = doc._id;
          done();
        });
      });
  });

  describe('[ARTICLES]', function () {
    let idArticle;
    before('Retrieve article id', function(done) {
      ArticleModel.findOne({}).sort({creationDate: -1})
        .exec(function (err, doc) {
          idArticle = doc._id;
          done();
        });
    });

    it('GET -> get my roles', function (done) {
      requester.get(`/api/roles/article/user`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'role');
          expect(res.body.success).to.be.true;
          expect(res.body.role).to.be.an.instanceOf(Array);
          expect(res.body.role[0]).to.contain.key('id_user', 'id_article', '_id', 'right');
          done();
        })
    });

    it('GET -> get users roles', function (done) {
      requester.get(`/api/roles/article/user/${userId}`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'role');
          expect(res.body.success).to.be.true;
          expect(res.body.role).to.be.an.instanceOf(Array);
          done();
        })
    });

    it('GET -> get users & roles on an article', function (done) {
      requester.get(`/api/roles/article/${idArticle}`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'users');
          expect(res.body.success).to.be.true;
          expect(res.body.users).to.be.an.instanceOf(Array);
          done();
        })
    });

    it('GET -> get authors on an article', function (done) {
      requester.get(`/api/roles/article/${idArticle}/author`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'users');
          expect(res.body.success).to.be.true;
          expect(res.body.users).to.be.an.instanceOf(Array);
          done();
        })
    });

    it('GET -> get AE on an article', function (done) {
      requester.get(`/api/roles/article/${idArticle}/associateEditor`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'users');
          expect(res.body.success).to.be.true;
          expect(res.body.users).to.be.an.instanceOf(Array);
          done();
        })
    });

    it('GET -> get reviewers on an article', function (done) {
      requester.get(`/api/roles/article/${idArticle}/reviewer`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'users');
          expect(res.body.success).to.be.true;
          expect(res.body.users).to.be.an.instanceOf(Array);
          done();
        })
    });
  });

  describe('[JOURNALS]', function() {
    let idJournal;
    before('Retrieve journal id', function (done) {
      JournalModel.findOne({}).sort({creationDate: -1}).exec(function (err, doc) {
        idJournal = doc._id;
        done();
      });
    });

    it('GET -> get my roles', function (done) {
      requester.get(`/api/roles/journal/user`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'role');
          expect(res.body.success).to.be.true;
          expect(res.body.role).to.be.an.instanceOf(Array);
          expect(res.body.role[0]).to.contain.key('id_user', 'id_journal', '_id', 'right');
          done();
        })
    });

    it('GET -> get users roles', function (done) {
      requester.get(`/api/roles/journal/user/${userId}`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'role');
          expect(res.body.success).to.be.true;
          expect(res.body.role).to.be.an.instanceOf(Array);
          done();
        })
    });

    it('GET -> get users & roles on a journal', function (done) {
      requester.get(`/api/roles/journal/${idJournal}`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'users');
          expect(res.body.success).to.be.true;
          expect(res.body.users).to.be.an.instanceOf(Array);
          done();
        })
    });

    it('GET -> get editors on an article', function (done) {
      requester.get(`/api/roles/article/${idJournal}/editor`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'users');
          expect(res.body.success).to.be.true;
          expect(res.body.users).to.be.an.instanceOf(Array);
          done();
        })
    });

    it('GET -> get AE on an article', function (done) {
      requester.get(`/api/roles/journal/${idJournal}/associate_editor`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'users');
          expect(res.body.success).to.be.true;
          expect(res.body.users).to.be.an.instanceOf(Array);
          done();
        })
    });

    it('GET -> get reviewers on an article', function (done) {
      requester.get(`/api/roles/journal/${idJournal}/user`)
        .set(headers)
        .end((req, res) => {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res.body).to.contain.key('success', 'users');
          expect(res.body.success).to.be.true;
          expect(res.body.users).to.be.an.instanceOf(Array);
          done();
        })
    });
  })
});
