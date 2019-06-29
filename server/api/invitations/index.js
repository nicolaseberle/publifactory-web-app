'use strict'

var express = require('express')
var controller = require('./invitations.controller')
var auth = require('../../auth/auth.service')
const rolesArticle = require('../roles/article/roles.article.controller');
const rolesJournal = require('../roles/journal/roles.journal.controller');

var router = express.Router()

router.use('/invite/:role(reviewer|collaborator|associate_editor|editor)', async function (req, res, next) {
  try {
    if(req.params.role === 'reviewer' || req.params.role  === 'collaborator') {
      req.route = `invite${req.params.role === 'reviewer' ? 'Reviewer' : 'Collaborator'}`;
      req.params.id = req.query.id_article;
      await rolesArticle.doYouHaveThisRight(req, res, next);
    }
    else {
      req.route = `invite${req.params.role} === 'associate_editor' ? 'AssociateEditor' : 'Editor'}`;
      req.params.id = req.query.id_journal;
      await rolesJournal.doYouHaveThisRight(req, res, next);
    }
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
})

router.post('/invite/:role(reviewer|collaborator|associate_editor|editor)', controller.createInvitation)
router.get('/myInvitations', controller.getMyInvitations)
router.get('/invite/:id', controller.checkInvitation)

module.exports = router
