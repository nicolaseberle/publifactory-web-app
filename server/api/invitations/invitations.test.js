'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

const config = require('../../config/test');
const UserModel = require('../user/user.model');;
const ArticleModel = require('../article/article.model');

const connection = require('../../app');
const requester = chai.request(connection).keepOpen();

describe('[ARTICLE]', function () {
  this.timeout(10000)
  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${config.token}`
  };

  let body = {};
  let idUser, idInvite, idArticle, keepLink;

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
          });
        UserModel.findOne({}).exec(function (err, doc) {
          idUser = doc._id;
          done();
        });
      });
  });

  it('POST -> invite new collaborator', function (done) {
    let shortId = shortid.generate();
    while (shortId.indexOf('-') >= 0) {
      shortId = shortid.generate();
    }
    let link = shortId;
    let inviteTo = 'test@test.fr';
    let message = "toto";
    keepLink = link;
    body = {
      link: link,
      msg: message,
      to: inviteTo,
      name: idUser
    };
    requester.post('api/invitations/invite/collaborator')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('name', 'orcid', 'lastname', 'firstname',
          'email', 'roles', 'isVerified', '__v', '_id', 'articleRights', 'avatar', 'field', 'hashedPassword',
          'invitationId', 'link', 'lockedAccount', 'provider', 'role', 'salt', 'tags');
        done();
      })
  });

  it('POST -> invite new reviewer', function (done) {
    let shortId = shortid.generate();
    while (shortId.indexOf('-') >= 0) {
      shortId = shortid.generate();
    }
    let link = shortId;
    let inviteTo = 'test@test.fr';
    let message = "toto";
    body = {
      link: link,
      msg: message,
      to: inviteTo,
      name: idUser
    };
    requester.post('api/invitations/invite/reviewer')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('name', 'orcid', 'lastname', 'firstname',
          'email', 'roles', 'isVerified', '__v', '_id', 'articleRights', 'avatar', 'field', 'hashedPassword',
          'invitationId', 'link', 'lockedAccount', 'provider', 'role', 'salt', 'tags');
        done();
      })
  });

  it('POST -> invite someone with missing parameter', function (done) {
    let inviteTo = 'test@test.fr';
    let message = "toto";
    body = {
      msg: message,
      to: inviteTo,
      name: idUser
    };
    requester.post('api/invitations/invite/')
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

  it('GET -> check invitation', function (done) {
    requester.get('/api/invitations/invite/' + keepLink)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('kek');
        done();
      })
  });
});
