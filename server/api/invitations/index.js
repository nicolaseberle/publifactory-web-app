'use strict'

var express = require('express')
var controller = require('./invitations.controller')
var auth = require('../../auth/auth.service')
const rolesArticle = require('../roles/article/roles.article.controller')
const rolesJournal = require('../roles/journal/roles.journal.controller')
const jwtCheck = require('../../auth/jwt')

var router = express.Router()

router.get('/invite/:id', controller.checkInvitation)

router.use(function (req, res, next) {
  jwtCheck(req, res, next)
})

router.use('/invite/:role(reviewer|collaborator|associate_editor|editor)', async function (req, res, next) {
  try {
    if (req.params.role === 'reviewer' || req.params.role === 'collaborator') {
      req.route = `invite${req.params.role === 'reviewer' ? 'Reviewer' : 'Collaborator'}`
      req.params.id = req.query.id_article
      await rolesArticle.doYouHaveThisRight(req, res, next)
    } else {
      req.route = `invite${req.params.role} === 'associate_editor' ? 'AssociateEditor' : 'Editor'}`
      req.params.id = req.query.id_journal
      await rolesJournal.doYouHaveThisRight(req, res, next)
    }
  } catch (e) {
    next(e)
  }
})

router.post('/invite/:role(reviewer|collaborator|associate_editor|editor)', jwtCheck, controller.createInvitation)

// async function createGuestAccount (req, res, next) {
//   try {
//     if (!(req.body.email && req.body.firstname && req.body.lastname)) { throw { code: 422, message: 'Missing parameters.' } }
//     req.body.isVerified = true
//     var newUser = new User(req.body)
//     newUser.provider = 'local'
//     newUser.role = 'guest'
//     newUser.roles = ['guest']
//     const user = await newUser.save()
//     const token = jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
//     const mail = new Email(req.body.email)
//     // mail.sendMailSetPassword()
//     return res.status(200).json({ token }).end()
//   } catch (e) {
//     next(e)
//   }
// }

module.exports = router
