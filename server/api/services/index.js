'use strict';

var express = require('express')
const serviceController = require('./services.controller');

var router = express.Router()

//router.get('/searchReviewers', serviceController.searchReviewers);
//router.post('/getInfoFile', serviceController.getInfoFile);
router.post('/sendEvaluation', serviceController.sendEvaluation);
router.get('/getEvaluation', serviceController.getEvaluation);

module.exports = router
