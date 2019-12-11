const express = require('express');
const controllers = require('./controllers');
const router = express.Router();


router.post('/create', controllers.create);
router.get('/', controllers.list);

module.exports = router;
