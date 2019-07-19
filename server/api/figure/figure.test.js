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
const requester = chai.request(connection).keepOpen()

describe('[ARTICLE]', function () {
  this.timeout(10000)
  const headers = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${config.token}`
  };

  let body, query = {};
  let idArticle, idFigure = '';

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

  it('POST -> create figure', function (done) {
    body = {
      data: [{
        x: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
        y: [10, 9, 12, 13],
        type: 'bar',
        orientation: 'v'
      }],
      option: {},
      layout: {
        title: 'Title',
        showlegend: false
      }
    };
    requester.post('/api/figure/')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(201);
        expect(res.body).to.contain.key('_id');
        idFigure = res.body._id;
        done()
      });
  });

  it('POST -> create figure', function (done) {
    body = {
      option: {},
      layout: {
        title: 'Title',
        showlegend: false
      }
    };
    requester.post('/api/figure/')
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(422);
        expect(res.body).to.contain.key('success', 'message');
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.equal('Missing parameters.');
        done()
      });
  });

  it('PUT -> update figure', function (done) {
    body = {
      data: [{
        x: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
        y: [10, 9, 12, 13],
        type: 'bar',
        orientation: 'v'
      }],
      option: {},
      layout: {
        title: 'Title',
        showlegend: false
      },
      script: {
        language: "R",
        content: [{
          title: 'main.R',
          name: '1',
          content: this.$t('template.RFirst')
        }]
      },
      infos: {
        legend: 'Test figure',
        source: 'http://dx.doi.org/00.0000/e0000000',
        name: 'INSERT TITLE HERE',
        uuid_figure: idFigure
      }
    };
    requester.put('/api/figure/' + idFigure)
      .set(headers)
      .send(body)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('_id');
        done();
      });
  });

  it('PUT -> update figure with missing parameters', function (done) {
    body = {
      data: [{
        x: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
        y: [10, 9, 12, 13],
        type: 'bar',
        orientation: 'v'
      }],
      option: {},
      layout: {
        title: 'Title',
        showlegend: false
      },
      infos: {
        legend: 'Test figure',
        source: 'http://dx.doi.org/00.0000/e0000000',
        name: 'INSERT TITLE HERE',
        uuid_figure: idFigure
      }
    };
    requester.put('/api/figure/' + idFigure)
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

  it('GET -> get figure by id', function (done) {
    requester.get('/api/figure/' + idFigure)
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('figure');
        expect(res.body.figure).to.be.an.instanceOf(Array);
        done();
      });
  });

  it('GET -> get figure by wrong id', function (done) {
    requester.get('/api/figure/5197c6b453cce2ec3a743811')
      .set(headers)
      .end((req, res) => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.contain.key('figure');
        expect(res.body.figure).to.be.an.instanceOf(Array);
        expect(res.body.figure).to.be.empty;
        done();
      });
  });
});
