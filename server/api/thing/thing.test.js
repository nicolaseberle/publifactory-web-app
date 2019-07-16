'use strict';

const chai = require('chai');
chai.use(require('chai-json-schema'));
chai.use(require('chai-match-pattern'));
chai.use(require('chai-http'));

const config = require('../user')
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const connection = require('../../app');
var request = require('supertest')

describe('GET /api/things', function () {
  it('should respond with JSON array', function (done) {
    request(app)
      .get('/api/things')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err)
        res.body.should.be.instanceof(Array)
        done()
      })
  })
})
