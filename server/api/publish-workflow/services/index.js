const submitToCollection = require('./submit-to-collection');
const submitToPreprintCollection = require('./submit-to-preprint-collection');
const answerSubmission = require('./answer-submission');
const answerEditorInvitation = require('./answer-editor-invitation');
const inviteAuthorToSubmit = require('./invite-author-to-submit');
const isAuthorLead = require('./is-author-lead');
const getPreprintCollection = require('./get-preprint-collection');
const inviteReviewer = require('./invite-reviewer');

module.exports = {
	submitToCollection,
	submitToPreprintCollection,
	answerSubmission,
	answerEditorInvitation,
	inviteAuthorToSubmit,
	isAuthorLead,
	getPreprintCollection,
	inviteReviewer
};
