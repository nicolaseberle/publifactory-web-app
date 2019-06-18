'use strict';

const express = require('express')
const router = express.Router()

router.use('/article', require('./article'))
router.use('/journal', require('./journal'))

module.exports = router
