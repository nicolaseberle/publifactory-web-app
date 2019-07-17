'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const config = require('../../config/test')

const connection = require('../../app');

describe('[USER]', async () => {
  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${config.token}`
  };

  let body = {};

  before('Retrieve token', function () {
    chai.request(connection).post('/api/auth/local')
      .set({'Content-Type': 'application/json'})
      .send({'login': config.email, 'password': config.password})
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);

        //Check body params
        expect(res.body).to.contain.key("token");
        //Write token for other tests
        if (res.body.token !== undefined) {
          headers["authorization"] = 'Bearer' + res.body.token;
          config.token = res.body.token;
          fs.unlinkSync(path.join('../../config/test.json'));
          fs.writeFileSync(path.join('../../config/test.json'), JSON.stringify(config));
        }
      })
  });

  it('POST -> create user', function(done) {
    body = {
      email: 'user@test.fr',
      password: 'user_pwd',
      provider: 'local'
    };
    chai.request(connection).post('/api/users')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(201);
        expect(res.body).to.contain.key('token');
        done();
      });
  });

  it('POST -> create user with same email', function(done) {
    body = {
      email: 'user@test.fr',
      password: 'user_pwd',
      provider: 'local'
    };
    chai.request(connection).post('/api/users')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(403);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('This email exists already');
        done();
      });
  });

  it('POST -> Create user with missing parameters', function(done) {
    body = {
      email: 'unit@test.fr',
      provider: 'local'
    };
    chai.request(connection).post('/api/users/')
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

  it('POST -> create guest', function(done) {
    body = {
      email: 'guest@test.fr',
      password: 'guest_pwd',
      firstname: 'guest',
      lastname: 'guest'
    };
    chai.request(connection).post('/api/users/guest')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('user');
        expect(res.body.user).to.contain.key('name', 'orcid', 'lastname', 'firstname',
          'email', 'roles', 'isVerified', '__v', '_id', 'articleRights', 'avatar', 'field', 'hashedPassword',
          'invitationId', 'link', 'lockedAccount', 'provider', 'role', 'salt', 'tags');
        expect(res.body.user.email).to.be.equal('guest@test.fr');
        expect(res.body.user.isVerified).to.be.true;
        expect(res.body.user.firstname).to.be.equal('guest');
        expect(res.body.user.lastname).to.be.equal('guest');
        expect(res.body.user.roles[0]).to.be.equal('guest');
        done();
      })
  });

  it('POST -> create guest with missing parameters', function(done) {
    body = {
      email: 'guest@test.fr',
      password: 'kek'
    };
    chai.request(connection).post('/api/users/guest')
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


  it('GET -> get user informations', function(done) {
    chai.request(connection).get('/api/users/me')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.contain('user');
        expect(res.body.user).to.contain.key('name', 'username', 'orcid', 'lastname', 'firstname',
        'email', 'roles', 'isVerified');
        expect(res.body.user.email).to.be.equal('leo.riberon-piatyszek@epitech.eu');
        expect(res.body.user.isVerified).to.be.true;
        expect(res.body.user.roles[0]).to.be.equal('editor');
        done();
      })
  });

  it('PUT -> update user infos', function(done) {
    body = {
      firstname: 'Léo',
      lastname: 'Riberon-Piatyszek',
      field: 'Developer'
    };
    chai.request(connection).put('/api/users/updateUser')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('user');
        expect(res.body.user).to.contain.key('name', 'firstname', 'lastname',
          'username', 'orcid', 'lastname', 'firstname',
          'email', 'roles', 'isVerified', 'field');
        expect(res.body.user.email).to.be.equal('leo.riberon-piatyszek@epitech.eu');
        expect(res.body.user.isVerified).to.be.true;
        expect(res.body.user.roles[0]).to.be.equal('editor');
        expect(res.body.user.firstname).to.be.equal('Léo');
        expect(res.body.user.lastname).to.be.equal('Riberon-Piatyszek');
        expect(res.body.user.field).to.be.equal('Developer');
        done();
      })
  });

  it('PUT -> update user infos with missing parameter', function(done) {
    body = {
      firstname: 'Léo',
      field: 'Developer'
    };
    chai.request(connection).put('/api/users/updateUser')
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

  it('PUT -> change password', function(done) {
    body = {
      oldPassword: 'Vtqlf&wD',
      newPassword: '-Ksg&wsD6'
    };
    chai.request(connection).put('/api/users/changePassword')
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

  it('PUT -> change password with missing parameter', function(done) {
    body = {
      newPassword: '-Ksg&wsD6'
    };
    chai.request(connection).post('/api/users/changePassword')
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

  it('PUT -> change password with same old password', function(done) {
    body = {
      oldPassword: '-Ksg&wsD6',
      newPassword: '-Ksg&wsD6'
    };
    chai.request(connection).put('/api/users/changePassword')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(409);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Duplicate entry.');
        done();
      })
  });

  it('PUT -> reset password', function(done) {
    body = {
      email: 'user@test.fr'
    };
    chai.request(connection).put('/api/users/resetPassword')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('token');
        done();
      })
  });

  it('PUT -> reset password with missing parameters', function(done) {
    body = {};
    chai.request(connection).put('/api/users/resetPassword')
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

  it('PUT -> reset password with non-existent email', function(done) {
    body = {
      email: 'non-existantUser@test.fr'
    };
    chai.request(connection).put('/api/users/resetPassword')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(403);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('User not found.');
        done();
      })
  });
});
