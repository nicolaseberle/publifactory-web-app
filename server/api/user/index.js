'use strict'

var express = require('express')
var controller = require('./user.controller')
var auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/', auth.hasRole('admin'), controller.index)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)
router.get('/me', auth.isAuthenticated(), controller.me)
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword)
router.put('/:id/guestPassword', auth.isAuthenticated(), controller.changeGuestPassword)
router.put('/:id/updateUser', auth.isAuthenticated(), controller.updateUser)
router.get('/:id', auth.isAuthenticated(), controller.show)
router.post('/', controller.create)
router.post('/guest', controller.createGuest)

module.exports = router
