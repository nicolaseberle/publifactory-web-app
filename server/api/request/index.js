const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

/**
 * Todo:
 *    Emailing hook on update <-> email actions
 */

// Base route: '/api/request'

router.get('/', controllers.list);
router.post('/', controllers.create);
router.get('/:requestId', controllers.read);
router.patch('/:requestId', controllers.update);
router.delete('/:requestId', controllers.remove);

module.exports = router;
