'use strict';

var express = require('express')
const emailerController = require('./emailer.controller');

var router = express.Router()

router.post('/', emailerController.sendMailToCoAuthor);

module.exports = router;
