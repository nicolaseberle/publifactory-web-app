'use strict';

const express = require('express');
const journalController = require('./journal.controller');
const controllers = require('./controllers');
const journalMiddlewares = require('./middlewares');
const middlewares = require('../../middlewares/index');
const rolesJournal = require('../roles/journal/roles.journal.controller');

const auth = require('../../auth/auth.service');
const roles = require('../roles/journal/roles.journal.controller');

const router = express.Router();

router.post('/', controllers.create);

router.get('/', controllers.list);

router.post(
	'/admin/:journalId/:userId',
	middlewares.requireAdminRole,
	controllers.activate
);

router.get('/:id', controllers.read);

router.post(
	'/:id/article',
	journalMiddlewares.requireActivation,
	journalController.addArticleToJournal
);
router.delete(
	'/:id/article/:id_article',
	roles.owner,
	journalController.removeArticleFromJournal
);
router.put(
	'/:id',
	roles.administration,
	journalController.findJournalByIdAndUpdate
);
router.patch('/:id/tags', roles.administration, journalController.updateTags);
router.get('/followed/all', journalController.userFollowedJournals);
router.use('/:id/removeJournal', async function(req, res, next) {
	try {
		req.route = 'removeJournal';
		await rolesJournal.doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
});

router.delete('/:id/removeJournal', journalController.deleteJournal);

router.use('/:id/addAssociateEditor', async function(req, res, next) {
	try {
		req.route = 'inviteAssociateEditor';
		await rolesJournal.doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
});

router.put(
	'/:id/addAssociateEditor',
	journalMiddlewares.requireActivation,
	journalController.addAssociateEditor
);

router.use('/:id/removeAssociateEditor', async function(req, res, next) {
	try {
		req.route = 'removeAssociateEditor';
		await rolesJournal.doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
});
router.put(
	'/:id/removeAssociateEditor',
	journalMiddlewares.requireActivation,
	journalController.removeAssociateEditor
);

router.get(
	'/:id/users/:role(editor|associate_editor|user)?',
	journalController.getJournalsUser
);
router.patch(
	'/:id/article/:id_article',
	roles.publish,
	journalMiddlewares.requireActivation,
	journalController.setArticlePublish
);
router.post(
	'/:id/invite/:right(associate_editor|user)',
	roles.invite,
	journalMiddlewares.requireActivation,
	journalController.inviteUser
);

router.use('/:id/follow', async function(req, res, next) {
	try {
		req.route = 'unfollowJournal';
		await rolesJournal.doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
});
router.post('/:id/follow', journalController.followJournal);

module.exports = router;
