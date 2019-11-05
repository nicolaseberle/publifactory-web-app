const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

// Base route: '/api/publishers'

router.get('/:publisherId', controllers.read);
// router.get('/' controllers.list);

module.exports = router;
