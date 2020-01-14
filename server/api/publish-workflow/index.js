const express = require('express');
const publishWorkflow = require('./controllers');
const router = express.Router();
const authentication = require('../../auth/jwt');

// Init for preprint collection : (common pool)
require('./init/');

// Both Actions :

router.post(
	'/review/:articleId/:answer(accept|reject)',
	authentication,
	publishWorkflow.answerReviewInvitation // => inviteReviewer
);

// invite reviewers
router.post(
	'/invite/review/:articleId/',
	authentication,
	publishWorkflow.inviteReviewer // => answerReviewInvitation
);

// Article Status :

router.get('/', publishWorkflow.getPreprintCollection);

// Author Actions :

router.post(
	'/preprint/:articleId',
	authentication,
	publishWorkflow.submitToPreprintCollection
);

router.post(
	'/submit/:journalId/:articleId',
	authentication,
	publishWorkflow.submitToCollection // => answerSubmission
);

router.post(
	'/author/:journalId/:articleId/:answer(accept|reject)',
	authentication,
	publishWorkflow.answerEditorInvitation // => inviteAuthorToSubmit
);

// Editor Actions :

router.post(
	'/editor/:journalId/:articleId/:answer(accept|reject)',
	authentication,
	publishWorkflow.answerSubmission // => submitToCollection
);

router.post(
	'/invite/:journalId/:articleId',
	authentication,
	publishWorkflow.inviteAuthorToSubmit // => answerEditorInvitation
);

module.exports = router;
