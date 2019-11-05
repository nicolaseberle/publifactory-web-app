const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

// Base route: '/api/invitation-reviewers'

router.get('/:invitationReviewerId', controllers.readById);
router.get('/:publisherId/:invitationReviewerTitle', controllers.readByTitle);
router.delete('/:invitationReviewerId', controllers.remove);
router.patch('/:invitationReviewerId', controllers.update);
router.get('/', controllers.list);

module.exports = router;
