const express = require('express');
const requestRoutes = require('./api/request');
// const controllers = require('./controller');

const router = express.Router();

// Base route: '/api/invitation-reviewer'

const empty = (req, res, next) => {
	return res
		.status(200)
		.json({ ok: 'ok' })
		.end();
};

router.post('/', empty);
router.get('/', empty);

router.use('/requests', requestRoutes);

module.exports = router;
