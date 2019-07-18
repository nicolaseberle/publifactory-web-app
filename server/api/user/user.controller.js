'use strict'

var User = require('./user.model')
// var passport = require('passport')
var config = require('../../../config').backend
var jwt = require('jsonwebtoken')
var paging = require('../paging')
const shortid = require('shortid');
const bcrypt = require('bcrypt');

const configEmail = require('../../../config.js').email
var Invitation = require('../invitations/invitations.model');
const Email = require('../email/email.controller');

/**
 * Get list of users
 * restriction: 'admin'
 */
function index(req, res, next) {
  try {
    const search = {...req.query.search, ...{role: 'user'}};
    var page = {current: 1, limit: 10};
    paging.listQuery(User, search, '-salt -hashedPassword', {}, page, function (err, json) {
      if (err) throw {code: 500, message: err};
      res.json(json)
    })
  } catch (e) {
    next(e);
  }
}

async function createVerificationEmailInvitation(user) {
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
      if (user === null) {
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
            }, config.secrets.session, {expiresIn: '7d'})
            resolve(token)
          })
        })
        res.json({success: true, token: newToken})
      } else
        res.json({success: true})
    })
  } catch (err) {
    return next(err)
  }
}

function googleCreation(req, res, next) {
  try {
    /*
    * On teste l'existance de l'eamil dans la base avant de l'enregistrer.
    */
    User.findOne({email: req.body.email}, async function (err, user) {
      if (user === null) {
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
            }, config.secrets.session, {expiresIn: '7d'})
            resolve(token)
          })
        })
        res.json({success: true, token: newToken})
      } else
        res.json({success: true})
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * Creates a new user
 */
async function create(req, res, next) {
  try {
    /*
    * On teste l'existance de l'eamil dans la base avant de l'enregistrer.
    */
    if (!(req.body.email !== undefined && req.body.password !== undefined && req.body.provider !== undefined))
      throw {code: 422, message: 'Missing parameters.'};
    const user = await User.findOne({email: req.body.email});
    if (user === null) {
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
          }, config.secrets.session, {expiresIn: '7d'})
          await createVerificationEmailInvitation(user)
          resolve(token)
        })
      })
      res.status(201).json({token: newToken})
    } else {
      throw {code: 403, message: 'This email exists already'}
    }
  } catch (err) {
    next(err)
  }
}

/**
 * Create a guest account - a guest have to reset his password during the first connection
 */
async function createGuest(req, res, next) {
  try {
    if (!(req.body.email && req.body.password && req.body.firstname && req.body.lastname))
      throw { code: 422, message: 'Missing parameters.'};
    req.body.isVerified = true;
    var newUser = new User(req.body)
    newUser.provider = 'local'
    newUser.role = 'guest'
    newUser.roles = ['guest']
    const user = await newUser.save()
    jwt.sign({_id: user._id, name: user.name, role: user.role}, config.secrets.session, {expiresIn: '7d'});
    res.json({user: newUser})
  } catch (e) {
    next(e)
  }
}

/**
 * Get a single user
 */
async function show(req, res, next) {
  try {
    var userId = req.params.id
    const user = await User.findById(userId);
    if (!user)
      throw { code: 404, message: 'User not found.' };
    res.json(user.profile)
  } catch (e) {
    next(e);
  }
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
async function destroy(req, res, next) {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}

/**
 * Change a users password
 */
async function changePassword(req, res, next) {
  try {
    if (req.body.oldPassword === undefined || req.body.newPassword === undefined)
      throw { code: 422, message: 'Missing parameters.' };
    if (req.body.oldPassword === req.body.newPassword)
      throw { code: 409, message: 'Duplicate entry.' };
    var userId = req.decoded._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    const user = await User.findById(userId);
    if (bcrypt.compareSync(oldPass, user.hashedPassword)) {
      user.password = newPass;
      user.save(function (err) {
        if (err) return validationError(res, err);
        res.json({success: true})
      })
    } else {
      throw { code: 403, message: 'Old password is not correct.' };
    }
  } catch (err) {
    next(err)
  }
}

/**
 * Change a guest password and convert it in user // we check that the guest is on the list
 */
async function changeGuestPassword(req, res, next) {
  try {
    var userId = req.params.id
    var newPass = String(req.body.password)
    console.log("changeGuestPassword :: beginning ", userId)
    let user = await User.findById(userId)
    console.log("changeGuestPassword :: ", user)
    const invite = await Invitation.findById(user.invitationId)
    console.log("changeGuestPassword :: ", invite)
    if (user.authenticate(invite.senderId)) {
      console.log("user.authenticate :: ")
      const query = {
        _id: userId
      };
      const toSet = {
        $set: {
          password: newPass,
          role: 'user',
          roles: ['user'],
          invitationId: 'None'
        }
      };
      const updatedUser = await User.findOneAndUpdate(query, toSet);
      console.log("changeGuestPassword ::  ", updateUser)
      const token = await jwt.sign({
        _id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role
      }, config.secrets.session, {expiresIn: '7d'})
      res.json({token: token})
    }
  } catch (err) {
    next(err)
  }
}

/**
 * Reset the password and convert it in user // we check that the guest is on the list
 */
async function resetPassword(req, res, next) {
  try {
    if (req.body.email === undefined)
      throw {code: 422, message: 'Missing parameters.'};
    let email = String(req.body.email)
    let senderMsg = 'reset'
    let newLink = shortid.generate()
    while (newLink.indexOf('-') >= 0) {
      newLink = shortid.generate()
    }
    let senderId = shortid.generate()
    while (senderId.indexOf('-') >= 0) {
      senderId = shortid.generate()
    }
    const user = await User.findOne({"email": email});
    if (!user)
      throw { code: 403, message: 'User not found.' };
    let senderName = user._id
    let current = new Date().toISOString()
    const newInvitation = new Invitation({
      "created_at": current,
      "updated_at": current,
      "link": newLink,
      "recieptEmail": email,
      "senderId": senderId,
      "senderMsg": senderMsg,
      "senderName": senderName
    });
    const invitation = await newInvitation.save((error, result) => {
      if (error) {
        return console.log(error);
      } else {
        //we send en email to reset the password
        const clientUrl = `${configEmail.rootHTML}/recover/password/${senderId}-${newLink}`;
        const gmail = new Email(email);
        gmail.sendRecuperationPassword(clientUrl);
        //sendResetEmail(email, newLink, newLink);
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
        config.secrets.session, {expiresIn: '7d'})
      res.json({token: token})
    })
    console.log(invitation)
  } catch (err) {
    return next(err)
  }
}

/**
 * update user settings - firstname, lastname, field... (no password)
 */
async function updateUser(req, res, next) {
  try {
    if (!(req.body.firstname && req.body.lastname && req.body.field))
      throw { code: 422, message: 'Missing parameters.' };
    var userId = req.decoded._id
    var firstname = String(req.body.firstname)
    var lastname = String(req.body.lastname)
    var field = String(req.body.field)
    console.log(firstname)
    const user = await User.findOneAndUpdate(
      {_id: userId},
      {$set: {firstname, lastname, field}},
      {new: true});
    if (!user)
      throw { code: 404, message: 'User not found.'}
    return res.json(user);
  } catch (err) {
    return next(err)
  }
};

/**
 * Get my info
 */
async function me(req, res, next) {
  try {
    var userId = req.decoded._id
    const user = await User.findOne({
      _id: userId
    }, '-salt -hashedPassword');
    if (!user)
      throw { code: 401, message: 'User not found.' };
    res.json(user)
  } catch (e) {
    next(e)
  }
}

/**
 * This method will be use to check if a user has verified his email !
 */
async function emailConfirmation(req, res, next) {
  try {
    if (!req.body.userId)
      throw { code: 422, message: "Missing parameter." };
    const regExp = /(.*?)-(.*?)$/g
    const match = regExp.exec(req.body.userId);
    const query = {_id: match[1]};
    const toReplace = {$set: {isVerified: true}};
    await User.updateOne(query, toReplace)
    res.json({ success: true });
  } catch (e) {
    next(e);
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
  googleCreation: googleCreation
}
