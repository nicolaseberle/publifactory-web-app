'use strict';

var express = require('express')
const controller = require('./picture.controller');

const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: 10 * 1024 * 1024
})

var router = express.Router()

router.post('/', multer.single("picture"), controller.addPicture)
router.get('/:id?', controller.getPictureById)
router.delete('/:id', controller.removePicture)
router.put('/:id', multer.single("picture"), controller.changeSource)

module.exports = router;
