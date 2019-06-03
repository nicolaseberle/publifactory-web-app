'use strict';

var express = require('express')
const journalController = require('./journal.controller');

var auth = require('../../auth/auth.service')

var router = express.Router()

router.post('/', journalController.createJournal);
router.get('/:id?', journalController.getJournals);
router.put('/:id', journalController.findJournalByIdAndUpdate);

router.post('/:id_journal/article', journalController.addArticleToJournal);
router.delete('/:id', journalController.deleteJournal);
router.delete('/:id_journal/article/:id_article', journalController.removeArticleFromJournal);

module.exports = router;
