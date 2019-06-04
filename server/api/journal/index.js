'use strict';

var express = require('express')
const journalController = require('./journal.controller');

var auth = require('../../auth/auth.service')
const roles = require('../roles/journal/roles.journal.controller')

var router = express.Router()

router.post('/', journalController.createJournal);
router.get('/:id?', journalController.getJournals);
router.post('/:id/article', roles.owner, journalController.addArticleToJournal);
router.delete('/:id/article/:id_article', roles.owner, journalController.removeArticleFromJournal);
router.put('/:id', roles.administration, journalController.findJournalByIdAndUpdate);
router.delete('/:id', roles.administration, journalController.deleteJournal);

router.patch('/:id/article/:id_article', roles.publish, journalController.setArticlePublish)
router.post('/:id/invite/:right(associate_editor|user)', roles.invite, journalController.inviteUser)
router.post('/:id/:action(follow|unfollow)', journalController.followJournal)


module.exports = router;
