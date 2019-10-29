const express = require('express');

const router = express.Router();

// Base route: '/api/invitation-reviewer/request'

const empty = (req, res, next) => {
	return res
		.status(200)
		.json({ ok: 'ok' })
		.end();
};

router.post('/', empty);
router.get('/', empty);

module.exports = router;
