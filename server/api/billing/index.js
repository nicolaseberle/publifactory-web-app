const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

// Base route: '/api/billings'

router.post('/users/:userId', controllers.create);
router.post('/journals/:journalId', controllers.create);
router.get('/:billingId', controllers.read);
router.patch('/:billingId', controllers.update);
// router.delete('/billingId', controllers.remove);

module.exports = router;
