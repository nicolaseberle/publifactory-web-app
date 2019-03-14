'use strict'

var express = require('express')
var controller = require('./invitations.controller')
var auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/myInvitations', controller.getMyInvitations)
router.post('/invite', controller.createInvitation)
router.get('/invite/:id', controller.checkInvitation)

module.exports = router
