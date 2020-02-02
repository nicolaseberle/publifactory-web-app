'use strict'

var express = require('express')
var controller = require('./user.controller')
var auth = require('../../auth/auth.service')

const jwtCheck = require('../../auth/jwt')

var router = express.Router()

router.use('/avatars/', require('./avatar'))

router.post('/', controller.create)
router.post('/orcid', controller.orcidCreation)
router.post('/google', controller.googleCreation)
router.post('/guest', controller.createGuest)
router.patch('/confirmation', controller.emailConfirmation)
router.put('/resetPassword', controller.resetPassword)
router.get('/', auth.hasRole('admin'), controller.index)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)
router.get('/me', jwtCheck, auth.isAuthenticated(), controller.me)
router.put('/:id/guestPassword', auth.isAuthenticated(), controller.changeGuestPassword)
router.put('/updateUser', jwtCheck, auth.isAuthenticated(), controller.updateUser)
router.put('/changePassword', jwtCheck, auth.isAuthenticated(), controller.changePassword)
router.get('/:id', jwtCheck, auth.isAuthenticated(), controller.show)

module.exports = router
