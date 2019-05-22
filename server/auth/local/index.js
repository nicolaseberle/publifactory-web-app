'use strict'

const express = require('express')
const passport = require('passport')
const auth = require('../auth.service')
const UserController = require('../../api/user/user.controller')

const router = express.Router()

/**
 * This route able to login with Local passport Strategy.
 * It returns 200 when success.
 * Otherwise, it returns 401 if some parameters are false and 404 if the user doesn't exist.
 */
router.post('/', async function (req, res, next) {
  await new Promise(() => {
    passport.authenticate('local', async function (err, user, info) {
      const error = err || info
      if (error) return res.status(401).json(error)
      if (!user) return res.status(404).json({ message: 'Something went wrong, please try again.' })
      if (user.isVerified === false) {
        // We send an email confirmation because the first link hasn't been activated yet
        // The older mail could be removed or loose for any reasons, then we send another one
        await UserController.createVerificationEmailInvitation(user)
        return res.sendStatus(401)
          .json({ message: 'You didn\'t verify your email. Confirm your email first before to log in.' })
      }
      const token = auth.signToken(user)
      res.json({ token: token })
    })(req, res, next)
  })
})

module.exports = router
