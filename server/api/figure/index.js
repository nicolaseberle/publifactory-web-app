'use strict';

var express = require('express')
const figureController = require('./figure.controller');

var auth = require('../../auth/auth.service')

var router = express.Router()

router.post('/', figureController.createFigure);
router.get('/:id', figureController.getFigure);

module.exports = router;
