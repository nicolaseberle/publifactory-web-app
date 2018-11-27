'use strict';

var express = require('express')
const dataController = require('./data.controller');

var auth = require('../../auth/auth.service')

var router = express.Router()

router.post('/', dataController.createData);
router.get('/:id', dataController.getData);

module.exports = router;
