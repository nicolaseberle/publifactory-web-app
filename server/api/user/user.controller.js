'use strict'

var User = require('./user.model')
// var passport = require('passport')
var config = require('../../../config').backend
var jwt = require('jsonwebtoken')
var paging = require('../paging')
const shortid = require('shortid');

const configEmail = require('../../../config.js').email
var Invitation = require('../invitations/invitations.model');
const Email = require('../email/email.controller');
const rolesJournal = require('../roles/journal/roles.journal.model')

var validationError = function (res, err) {
  return res.status(422).json(err)
}

/**
 * Get list of users
 * restriction: 'admin'
 */
function index (req, res) {
  var search = {...req.query.search, ...{ role: 'user' }}
  var page = {current : 1 ,limit: 10}
  paging.listQuery(User, search, '-salt -hashedPassword', {}, page, function (err, json) {
    if (err) return res.status(500).send(err)
    res.status(200).json(json)
  })
}

async function createVerificationEmailInvitation (user) {
  try {
    let email = String(user.email)
    let senderMsg = 'verification'
    let newLink = shortid.generate()
    while (newLink.indexOf('-') >= 0) {
      newLink = shortid.generate()
    }
    let senderName = user._id
    let current = new Date().toISOString()
    const newInvitation = new Invitation({
      "created_at": current,
      "updated_at": current,
      "link": newLink,
      "recieptEmail": email,
      "senderId": newLink,
      "senderMsg": senderMsg,
      "senderName": senderName
    });
    await newInvitation.save((error, result) => {
      if (error) {
        throw console.log(error);
      } else {
        // We send an email to make a confirmation link
        const clientUrl = `${configEmail.rootHTML}/login?userId=${senderName}-${newLink}`;
        const gmail = new Email(email);
        gmail.sendEmailConfirmation(clientUrl);
      }
    })
  } catch (e) {
    throw e;
  }
}

function orcidCreation(req, res, next) {
  try {
    /*
    * On teste l'existance de l'eamil dans la base avant de l'enregistrer.
    */
    User.findOne({email: req.body.email}, async function (err, user) {
      if(user===null) {
        var newUser = new User(req.body)
        newUser.provider = req.body.provider
        newUser.role = 'user'
        newUser.roles = ['user']
        const newToken = await new Promise((resolve, reject) => {
          newUser.save(async function (err, user) {
            //if (err) return validationError(res, err)
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
      } else
        res.json({ success: true })
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * Creates a new user
 */
function create(req, res, next) {
  try {
    /*
    * On teste l'existance de l'eamil dans la base avant de l'enregistrer.
    */
    User.findOne({email: req.body.email}, async function (err, user) {
      if(user===null) {
        var newUser = new User(req.body)
        newUser.provider = req.body.provider
        newUser.role = 'user'
        newUser.roles = ['user']
        const newToken = await new Promise((resolve, reject) => {
          newUser.save(async function (err, user) {
            //if (err) return validationError(res, err)
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
        res.json({ token: newToken })
      }
      else {
        res.status(403).json({ message: 'This email exists already' })
      }
    })
  }
  catch (err) {
     return next(err)
  }
}
/**
 * Create a guest account - a guest have to reset his password during the first connection
 */
function createGuest(req, res, next) {
  var newUser = new User(req.body)
  newUser.provider = 'local'
  newUser.role = 'guest'
  newUser.roles = ['guest']
  newUser.save(function (err, user) {
    if (err){
      return validationError(res, err)
    }
    var token = jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
    res.json({ user: newUser })
  })
}
/**
 * Get a single user
 */
function show(req, res, next) {
  var userId = req.params.id

  User.findById(userId, function (err, user) {
    if (err) return next(err)
    if (!user) return res.sendStatus(404)
    res.json(user.profile)
  })
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
function destroy(req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(500).send(err)
    return res.sendStatus(204)
  })
}

/**
 * Change a users password
 */
function changePassword(req, res, next) {
  try {
    var userId = req.user._id
    var oldPass = String(req.body.oldPassword)
    var newPass = String(req.body.newPassword)

    User.findById(userId, function (err, user) {
      if (err) {
        // handler error
      }
      if (user.authenticate(oldPass)) {
        user.password = newPass
        user.save(function (err) {
          if (err) return validationError(res, err)
          res.status(200).json({ message: 'ok' })
        })
      } else {
        res.status(403).json({ message: 'Old password is not correct.' })
      }
    })
  } catch (err) {
      return next(err)
  }
}

/**
 * Change a guest password and convert it in user // we check that the guest is on the list
 */
function changeGuestPassword(req, res, next) {
  try {
    var userId = req.params.id
    var newPass = String(req.body.password)

    User.findById( userId, function (_err, user) {
      console.log(user)
      Invitation.findById( user.invitationId , (err,invite)=>{
        console.log(invite)
        if (err) {
          console.log(err);
          next(err);
        }
        if (user.authenticate(invite.senderId)) {
          user.password = newPass
          user.role = 'user'
          user.roles = ['user']
          user.invitationId = 'None'
          user.save(function (err) {
            if (err) return validationError(res, err)
            var token = jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
            res.json({ token: token })
          })
        }
      })
    })
  } catch (err) {
      return next(err)
  }
}

/**
 * Reset the password and convert it in user // we check that the guest is on the list
 */
function resetPassword(req, res, next) {
  try {
    let email = String(req.body.email)
    let senderMsg = 'reset'
    let newLink = shortid.generate()
    while(newLink.indexOf('-')>=0){
      newLink = shortid.generate()
    }

    User.findOne({"email": email}, async function (_err, user) {
      let senderName = user._id
      let current = new Date().toISOString()
      const newInvitation = new Invitation({
        "created_at": current,
        "updated_at": current,
        "link": newLink,
        "recieptEmail": email,
        "senderId": newLink,
        "senderMsg": senderMsg,
        "senderName": senderName
      });
      const invitation = await newInvitation.save((error, result) => {
        if (error) {
          return console.log(error);
        } else {
          //we send en email to reset the password
          const clientUrl = `${configEmail.rootHTML}/recover/password/${senderName}-${newLink}`;
          const gmail = new Email(email);
          gmail.sendRecuperationPassword(clientUrl);
          //sendResetEmail(email, newLink, newLink);
        }
      })
      // temporary password is newLink - a random key
      user.password = newLink
      //user.role = 'guest'
      user.roles = ['guest']
      user.save(function (err) {
        if (err) return validationError(res, err)
        var token = jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
        res.json({ token: token })
      })
      console.log(invitation)
    })
  } catch (err) {
      return next(err)
  }
}

/**
 * update user settings - firstname, lastname, field... (no password)
 */
async function updateUser (req, res, next) {
  try {
    var userId = req.params.id
    var firstname = String(req.body.firstname)
    var lastname = String(req.body.lastname)
    var field = String(req.body.field)
    console.log(firstname)

    const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { firstname, lastname, field } },
            { new: true })

    if (!user) return res.sendStatus(404);

    return res.status(200).json(user);
  } catch (err) {
      return next(err)
  }
};

/**
 * Get my info
 */
function me(req, res, next) {
  var userId = req.user._id
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
    if (err) return next(err)
    if (!user) return res.json(401)
    res.json(user)
  })
}

/**
 * This method will be use to check if a user has verified his email !
 */
function emailConfirmation (req, res, next) {
  try {
    if (!req.body.userId)
      throw { code: 422, message: "Missing parameter." }
    const regExp = /(.*?)-(.*?)$/g
    const match = regExp.exec(req.body.userId);
    const query = { _id: match[1] };
    const toReplace = { $set: { isVerified: true } };
    User.updateOne(query, toReplace, (err, result) => {
      if (err) throw err;
      console.log("User verified.");
    });
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

async function getUsersJournal(req, res, next) {
  try {
    const journals = rolesJournal.find({id_user: req.decoded._id})
    res.json({success: true, journals: journals});
  } catch (e) {
    next(e)
  }
}

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
  getUsersJournal: getUsersJournal
}
