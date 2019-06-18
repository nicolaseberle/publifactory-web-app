'use strict'

var express = require('express')
var controller = require('./user.controller')
var auth = require('../../auth/auth.service')

var router = express.Router()

router.post('/', controller.create)
router.post('/orcid', controller.orcidCreation)
router.post('/guest', controller.createGuest)
router.patch('/confirmation', controller.emailConfirmation)
router.put('/resetPassword', controller.resetPassword)
router.get('/', auth.hasRole('admin'), controller.index)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)
router.get('/me', auth.isAuthenticated(), controller.me)
router.put('/:id/guestPassword', auth.isAuthenticated(), controller.changeGuestPassword)
router.put('/:id/updateUser', auth.isAuthenticated(), controller.updateUser)
router.put('/:id/changePassword', auth.isAuthenticated(), controller.changePassword)
router.get('/:id', auth.isAuthenticated(), controller.show)

module.exports = router
