'use strict'

var express = require('express')
var controller = require('./invitations.controller')
var auth = require('../../auth/auth.service')
const rolesArticle = require('../roles/article/roles.article.controller');
const rolesJournal = require('../roles/journal/roles.journal.controller');
const jwtCheck = require('../../auth/jwt');

var router = express.Router()

router.get('/invite/:id', controller.checkInvitation)

router.use(function(req, res, next) {
  jwtCheck(req, res, next);
})

router.use('/invite/:role(reviewer|collaborator|associate_editor|editor)', async function (req, res, next) {
  try {
    if (req.params.role === 'reviewer' || req.params.role  === 'collaborator') {
      req.route = `invite${req.params.role === 'reviewer' ? 'Reviewer' : 'Collaborator'}`;
      req.params.id = req.query.id_article;
      await rolesArticle.doYouHaveThisRight(req, res, next);
    } else {
      req.route = `invite${req.params.role} === 'associate_editor' ? 'AssociateEditor' : 'Editor'}`;
      req.params.id = req.query.id_journal;
      await rolesJournal.doYouHaveThisRight(req, res, next);
    }
  } catch (e) {
    next(e);
  }
})

router.post('/invite/:role(reviewer|collaborator|associate_editor|editor)', controller.createInvitation)

module.exports = router
