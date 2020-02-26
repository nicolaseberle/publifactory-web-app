'use strict'

var User = require('./user.model')
// var passport = require('passport')
var config = require('../../../config').backend
var jwt = require('jsonwebtoken')
var paging = require('../paging')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const fs = require('fs')

const configEmail = require('../../../config.js').email
var Invitation = require('../invitations/invitations.model')
const Email = require('../email/email.controller')
const serviceBilling = require('../billing/services')

/**
 * @function index
 * @description This function returns the list of every user in the database
 * Only the admin can execute this route.
 * @param req
 * @param res
 * @param next
 */
function index (req, res, next) {
  try {
    const search = { ...req.query.search, ...{ role: { $in: ['user', 'guest', 'editor'] }}}
    var page = { current: 1, limit: 10 }
    paging.listQuery(User, search, '-salt -hashedPassword', {}, page, function (err, json) {
      if (err) throw { code: 500, message: err }
      res.json(json)
    })
  } catch (e) {
    next(e)
  }
}

/**
 * @function createVerificationEmailInvitation
 * @description This function is used to create an email invitation
 * @param user
 * @return {Promise<void>}
 */
async function createVerificationEmailInvitation (user) {
  try {
    const email = String(user.email)
    const senderMsg = 'verification'
    let newLink = shortid.generate()
    while (newLink.indexOf('-') >= 0) {
      newLink = shortid.generate()
    }
    const senderName = user._id
    const current = new Date().toISOString()
    const newInvitation = new Invitation({
      'created_at': current,
      'updated_at': current,
      'link': newLink,
      'recieptEmail': email,
      'senderId': newLink,
      'senderMsg': senderMsg,
      'senderName': senderName
    })
    await newInvitation.save((error, result) => {
      if (error) {
        throw console.log(error)
      } else {
        // We send an email to make a confirmation link
        const clientUrl = `${configEmail.rootHTML}/login?userId=${senderName}-${newLink}`
        const gmail = new Email(email)
        gmail.sendEmailConfirmation(clientUrl)
      }
    })
  } catch (e) {
    throw e
  }
}

/**
 * @function orcidCreation
 * @description This function is used to create a new User from the ORCID's connexion
 * this function takes two parameters in the body field :
 *  - email, which is the ORCID's email specified on the ORCID website
 *  - provider, which is by default 'orcid'
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
function orcidCreation (req, res, next) {
  try {
    /*
    * On teste l'existance de l'eamil dans la base avant de l'enregistrer.
    */
    User.findOne({ email: req.body.email }, async function (err, user) {
      if (user === null) {
        var newUser = new User(req.body)
        newUser.provider = req.body.provider
        newUser.role = 'user'
        newUser.roles = ['user']
        const newToken = await new Promise((resolve, reject) => {
          newUser.save(async function (err, user) {
            // if (err) return validationError(res, err)
            if (err) reject(err)
            const token = jwt.sign({
              _id: user._id,
              name: user.name,
              role: user.role
            }, config.secrets.session, { expiresIn: '7d' })
            resolve(token)
          })
        })
        res.json({ success: true, token: newToken })
      } else { res.json({ success: true }) }
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * @function googleCreation
 * @description This function is used to create an User from the Google connexion
 * This functions takes two parameters in the body field :
 *  - email, which is the google's email
 *  - provider, which is by default 'google'
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
function googleCreation (req, res, next) {
  try {
    /*
    * On teste l'existance de l'eamil dans la base avant de l'enregistrer.
    */
    User.findOne({ email: req.body.email }, async function (err, user) {
      if (user === null) {
        var newUser = new User(req.body)
        newUser.provider = req.body.provider
        newUser.role = 'user'
        newUser.roles = ['user']
        const newToken = await new Promise((resolve, reject) => {
          newUser.save(async function (err, user) {
            // if (err) return validationError(res, err)
            if (err) reject(err)
            const token = jwt.sign({
              _id: user._id,
              name: user.name,
              role: user.role
            }, config.secrets.session, { expiresIn: '7d' })
            resolve(token)
          })
        })
        res.json({ success: true, token: newToken })
      } else { res.json({ success: true }) }
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * @function create
 * @description This function is used to create a new User from the local connexion
 * An email confirmation must be done to connect on the webapp
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function create (req, res, next) {
  try {
    /*
    * On teste l'existance de l'eamil dans la base avant de l'enregistrer.
    */
    if (!(req.body.email !== undefined && req.body.password !== undefined && req.body.provider !== undefined)) { throw { code: 422, message: 'Missing parameters.' } }
    const user = await User.findOne({ email: req.body.email })
    if (user === null) {
      var newUser = new User(req.body)
      newUser.provider = req.body.provider
      newUser.role = 'user'
      newUser.roles = ['user']
      const newToken = await new Promise((resolve, reject) => {
        newUser.save(async function (err, user) {
          // if (err) return validationError(res, err)
          if (err) reject(err)
          const token = jwt.sign({
            _id: user._id,
            name: user.name,
            role: user.role
          }, config.secrets.session, { expiresIn: '7d' })
          await createVerificationEmailInvitation(user)
          resolve(token)
        })
      })
      await serviceBilling.create({
        billing: {
          email: newUser.email,
          fullName: `${newUser.firstname} ${newUser.lastname}`
        },
        userId: newUser._id
      })
      return res.status(201).json({ token: newToken })
    } else {
      return res.json(403, { success: false, message: 'This email exists already' })
    }
  } catch (err) {
    next(err)
  }
}

/**
 * @function createGuest
 * @description This function is used to create a Guest account.
 * The new guest must change his password after clicking on the link in the email.
 * The creation take several parameters in the body field :
 *  - email
 *  - password
 *  - firstname
 *  - lastname
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function createGuest (req, res, next) {
  try {
    if (!(req.body.email && req.body.password && req.body.firstname && req.body.lastname)) { throw { code: 422, message: 'Missing parameters.' } }
    req.body.isVerified = true
    var newUser = new User(req.body)
    newUser.provider = 'local'
    newUser.role = 'guest'
    newUser.roles = ['guest']
    const user = await newUser.save()
    jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
    await serviceBilling.create({
      billing: {
        email: newUser.email,
        fullName: `${newUser.firstname} ${newUser.lastname}`
      },
      userId: newUser._id
    })
    res.json({ user: newUser })
  } catch (e) {
    next(e)
  }
}

/**
 * @function show
 * @description This function is used to returns User's information from its id.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function show (req, res, next) {
  try {
    var userId = req.params.id
    const user = await User.findById(userId)
    if (!user) { throw { code: 404, message: 'User not found.' } }
    res.json(user.profile)
  } catch (e) {
    next(e)
  }
}

/**
 * @function destroy
 * @description This function is used to delete an user from the platform.
 * This call is irrevocable.
 * This call must be used only by admins.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function destroy (req, res, next) {
  try {
    const user = User.findById(req.params.id)
    if (!user) throw { code: 422, message: 'Missing parameters.' }
    if (user.avatar) {
      if (!user.avatar.startsWith('/static')) { fs.unlinkSync(`.${user.avatar}`) }
    }
    await User.findByIdAndRemove(req.params.id)
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
}

/**
 * @function changePassword
 * @description This function is used to be called on the profile section.
 * This functions require two parameters in the body fields :
 *  - oldPassword, which is the common password the user used to be connected
 *  - newPassword, which is the new password to set
 * Caution: The oldPassword and the newPassword can't be the same
 * or it will result a HTTP 409 code for duplicate entry
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function changePassword (req, res, next) {
  try {
    if (req.body.oldPassword === undefined || req.body.newPassword === undefined) { throw { code: 422, message: 'Missing parameters.' } }
    if (req.body.oldPassword === req.body.newPassword) { throw { code: 409, message: 'Duplicate entry.' } }
    var userId = req.decoded._id
    var oldPass = String(req.body.oldPassword)
    var newPass = String(req.body.newPassword)

    const user = await User.findById(userId)
    if (bcrypt.compareSync(oldPass, user.hashedPassword)) {
      user.password = newPass
      user.save(function (err) {
        if (err) return validationError(res, err)
        res.json({ success: true })
      })
    } else {
      throw { code: 403, message: 'Old password is not correct.' }
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

/**
 * @function changeGuestPassword
 * @description This function is used to change the guests password after he connected from
 * the email's link.
 * It only takes a password parameter in the body field.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function changeGuestPassword (req, res, next) {
  try {
    var userId = req.params.id
    var newPass = String(req.body.password)
    const user = await User.findById(userId)
    const invite = await Invitation.findById(user.invitationId)
    // invite.senderId is the password
    if (user.authenticate(invite.senderId)) {
      user.password = newPass
      user.role = 'user'
      user.roles = ['user']
      user.invitationId = 'None'
      await user.save(function (err) {
        if (err) return validationError(res, err)
        var token = jwt.sign({
          _id: user._id,
          name: user.name,
          role: user.role
        },
        config.secrets.session, { expiresIn: '7d' })
        res.json({ token: token })
      })
    } else {
      throw { code: 403, message: 'Something is very wrong' }
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
}

/**
 * @function resetPassword
 * @description This function is used to reset the password if the user has forgotten it.
 * It only takes email parameter in the body field.
 * This function doesn't return the new password but send an email to the user
 * with a link to recover his password.
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */
async function resetPassword (req, res, next) {
  try {
    if (req.body.email === undefined) { throw { code: 422, message: 'Missing parameters.' } }
    const email = String(req.body.email)
    const senderMsg = 'reset'
    let newLink = shortid.generate()
    while (newLink.indexOf('-') >= 0) {
      newLink = shortid.generate()
    }
    let senderId = shortid.generate()
    while (senderId.indexOf('-') >= 0) {
      senderId = shortid.generate()
    }
    const user = await User.findOne({ 'email': email })
    if (!user) { throw { code: 403, message: 'User not found.' } }
    const senderName = user._id
    const current = new Date().toISOString()
    const newInvitation = new Invitation({
      'created_at': current,
      'updated_at': current,
      'link': newLink,
      'recieptEmail': email,
      'senderId': senderId,
      'senderMsg': senderMsg,
      'senderName': senderName
    })
    const invitation = await newInvitation.save((error, result) => {
      if (error) {
        return console.log(error)
      } else {
        // we send en email to reset the password
        const clientUrl = `${configEmail.rootHTML}/recover/password/${senderId}-${newLink}`
        const gmail = new Email(email)
        gmail.sendRecuperationPassword(clientUrl)
        // sendResetEmail(email, newLink, newLink);
      }
    })
    // temporary password is newLink - a random key
    user.password = senderId
    user.role = 'guest'
    user.roles = ['guest']
    await user.save(function (err) {
      if (err) return validationError(res, err)
      var token = jwt.sign({
        _id: user._id,
        name: user.name,
        role: user.role
      },
      config.secrets.session, { expiresIn: '7d' })
      res.json({ token: token })
    })
    console.log(invitation)
  } catch (err) {
    return next(err)
  }
}

/**
 * @function updateUser
 * @description This function is used to update the user's information on his profile section.
 * This function takes 3 parameters in the body field :
 *  - firstname
 *  - lastname
 *  - field, which is a short biography on the user's profile
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */
async function updateUser (req, res, next) {
  try {
    if (!(req.body.firstname && req.body.lastname && req.body.field)) { throw { code: 422, message: 'Missing parameters.' } }
    var userId = req.decoded._id
    var firstname = String(req.body.firstname)
    var lastname = String(req.body.lastname)
    var field = String(req.body.field)
    console.log(firstname)
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { firstname, lastname, field }},
      { new: true })
    if (!user) { throw { code: 404, message: 'User not found.' } }
    return res.json(user)
  } catch (err) {
    return next(err)
  }
}

/**
 * @function me
 * @description This function is used to get the user's information
 * It doesn't take any parameters and just recover the user's id from the decoded JWT
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function me (req, res, next) {
  try {
    var userId = req.decoded._id
    const user = await User.findOne({
      _id: userId
    }, '-salt -hashedPassword')
    if (!user) { throw { code: 401, message: 'User not found.' } }
    res.json(user)
  } catch (e) {
    next(e)
  }
}

/**
 * @function emailConfirmation
 * @description This function is used to confirm the user email from the link which has been sent.
 * This function takes an userId in the body field and we try to match a RegExp to
 * confirm the email.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function emailConfirmation (req, res, next) {
  try {
    if (!req.body.userId) { throw { code: 422, message: 'Missing parameter.' } }
    const regExp = /(.*?)-(.*?)$/g
    const match = regExp.exec(req.body.userId)
    const query = { _id: match[1] }
    const toReplace = { $set: { isVerified: true }}
    await User.updateOne(query, toReplace)
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}

/**
 *
 * @type {{resetPassword: *, changeGuestPassword: *, show: *, updateUser: *, index: *, destroy: *, orcidCreation: *, changePassword: *, createVerificationEmailInvitation: *, googleCreation: *, me: *, create: *, emailConfirmation: *, createGuest: *}}
 */
module.exports = {
  createVerificationEmailInvitation: createVerificationEmailInvitation,
  emailConfirmation: emailConfirmation,
  me: me,
  updateUser: updateUser,
  resetPassword: resetPassword,
  index: index,
  changeGuestPassword: changeGuestPassword,
  create: create,
  createGuest: createGuest,
  show: show,
  changePassword: changePassword,
  destroy: destroy,
  orcidCreation: orcidCreation,
  googleCreation: googleCreation
}
