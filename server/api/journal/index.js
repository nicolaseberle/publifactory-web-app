'use strict';

var express = require('express')
const journalController = require('./journal.controller');
const rolesJournal = require('../roles/journal/roles.journal.controller');

var auth = require('../../auth/auth.service')
const roles = require('../roles/journal/roles.journal.controller')

var router = express.Router()

router.post('/', journalController.createJournal);
router.get('/:id?', journalController.getJournals);
//router.post('/:id/article', roles.owner, journalController.addArticleToJournal);
router.post('/:id/article', journalController.addArticleToJournal);
router.delete('/:id/article/:id_article', roles.owner, journalController.removeArticleFromJournal);
router.put('/:id', roles.administration, journalController.findJournalByIdAndUpdate);

router.use('/:id/removeJournal', async function (req, res, next) {
  try {
    req.route = 'removeJournal'
    await rolesJournal.doYouHaveThisRight(req, res, next)
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
})
router.delete('/:id/removeJournal', journalController.deleteJournal);

router.use('/:id/addAssociateEditor', async function (req, res, next) {
  try {
    req.route = 'inviteAssociateEditor'
    await rolesJournal.doYouHaveThisRight(req, res, next)
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
})

router.put('/:id/addAssociateEditor', journalController.addAssociateEditor);

router.use('/:id/removeAssociateEditor', async function (req, res, next) {
  try {
    req.route = 'removeAssociateEditor'
    await rolesJournal.doYouHaveThisRight(req, res, next)
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
})
router.put('/:id/removeAssociateEditor', journalController.removeAssociateEditor);


router.get('/:id/users/:role(editor|associate_editor|user)', journalController.getJournalsUser)
router.patch('/:id/article/:id_article', roles.publish, journalController.setArticlePublish)
router.post('/:id/invite/:right(associate_editor|user)', roles.invite, journalController.inviteUser)

router.use('/:id/follow', async function (req, res, next) {
  try {
    req.route = 'unfollowJournal'
    await rolesJournal.doYouHaveThisRight(req, res, next)
  } catch (e) {
    return res.status(401).json({ success: false, message: e.message });
  }
})
router.post('/:id/follow', journalController.followJournal)

router.get('/followed/all', journalController.userFollowedJournals)


module.exports = router;
