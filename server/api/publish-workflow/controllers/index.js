const submitToPreprintCollection = require('./submit-to-preprint-collection');
const submitToCollection = require('./submit-to-collection');
const getPreprintCollection = require('./get-preprint-collection');
const answerSubmission = require('./answer-submission');
const answerEditorInvitation = require('./answer-editor-invitation');
const inviteAuthorToSubmit = require('./invite-author-to-submit');
const inviteReviewer = require('./invite-reviewer');
const answerReviewInvitation = require('./answer-review-invitation');

module.exports = {
	submitToPreprintCollection,
	submitToCollection,
	getPreprintCollection,
	answerSubmission,
	answerEditorInvitation,
	inviteAuthorToSubmit,
	inviteReviewer,
	answerReviewInvitation
};
