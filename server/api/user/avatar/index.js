const express = require('express')
const controllers = require('./controllers')
const { upload, fileFilter } = require('../../../config/multer')
const jwtCheck = require('../../../auth/jwt')

const router = express.Router()

router.post(
  '/:userId',
  // upload('avatars', fileFilter(/\.(jpg|jpeg|png|gif)$/)),,
  jwtCheck,
  controllers.upload
)

module.exports = router
