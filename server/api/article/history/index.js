'use strict';

var express = require('express')
const controller = require('./history.controller')

var router = express.Router()

router.get('/:id_article/:id_user?', controller.getHistory);

module.exports = router;
