'use strict'

var express = require('express')
// var passport = require('passport')
var config = require('../../config').backend
var User = require('../api/user/user.model')

// Passport Configuration
require('./local/passport').setupLogin(User, config)
require('./local/passport').setupOrcid(User, config)

var router = express.Router()

router.use('/local', require('./local'))

module.exports = router
