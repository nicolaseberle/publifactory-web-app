'use strict';

var express = require('express')
const controller = require('./picture.controller');

const Multer = require('multer');
var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/public/')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() +  '-' + file.originalname)
  }
})

var multer = Multer({ storage: storage })


var router = express.Router()

router.post('/', multer.single("picture"), controller.addPicture)
router.get('/:id?', controller.getPictureById)
router.delete('/:id', controller.removePicture)
router.put('/:id', multer.single("picture"), controller.updatePicture)

module.exports = router;
