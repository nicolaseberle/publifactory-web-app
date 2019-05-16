'use strict'

var express = require('express')
var controller = require('./invitations.controller')
var auth = require('../../auth/auth.service')

var router = express.Router()

router.post('/invite/:role(reviewer|collaborator)', controller.createInvitation)
router.get('/myInvitations', controller.getMyInvitations)
router.get('/invite/:id', controller.checkInvitation)

module.exports = router
