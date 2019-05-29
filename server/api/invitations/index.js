'use strict'

var express = require('express')
var controller = require('./invitations.controller')
var auth = require('../../auth/auth.service')
const roles = require('../roles/roles.controller');

var router = express.Router()

router.use('/invite/:role(reviewer|collaborator)', async function (req, res, next) {
  try {
    req.route = `invite${req.params.role === 'reviewer' ? 'Reviewer' : 'Collaborator'}`;
    req.params.id = req.query.id_article;
    await roles.doYouHaveThisRight(req, res, next);
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
})

router.post('/invite/:role(reviewer|collaborator)', controller.createInvitation)
router.get('/myInvitations', controller.getMyInvitations)
router.get('/invite/:id', controller.checkInvitation)

module.exports = router
