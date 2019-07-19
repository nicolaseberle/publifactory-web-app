'use strict';

var express = require('express')
const controller = require('./history.controller')
const articleRole = require('../../roles/article/roles.article.controller')

var router = express.Router()

router.get('/:id_article/:id_user?', articleRole.checkHistoryRight, controller.getHistory);
router.post('/:id_article', controller.insertInstruction);

module.exports = router;
