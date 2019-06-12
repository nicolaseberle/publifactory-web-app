'use strict';

var express = require('express')
const figureController = require('./figure.controller');

var auth = require('../../auth/auth.service')

var router = express.Router()

router.post('/', figureController.createFigure);
router.put('/:id', figureController.updateFigure);
router.get('/:id', figureController.getFigure);
router.post('/:script(python|r)', figureController.scripts)

module.exports = router;
