'use strict'

var User = require('./user.model')
// var passport = require('passport')
var config = require('../../../config').backend
var jwt = require('jsonwebtoken')
var paging = require('../paging')
const shortid = require('shortid');

const configEmail = require('../../../config.js').email
var Invitation = require('../invitations/invitations.model');
const nodemailer = require('nodemailer')

var validationError = function (res, err) {
  return res.status(422).json(err)
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
  var search = Object.assign(req.query.search, { role: 'user' })
  var page = {current : 1 ,limit: 10}
  paging.listQuery(User, search, '-salt -hashedPassword', {}, page, function (err, json) {
    if (err) return res.status(500).send(err)
    res.status(200).json(json)
  })
}

/**
 * Creates a new user
 */
exports.create = async function (req, res, next) {
  var newUser = new User(req.body)
  newUser.provider = 'local'
  newUser.role = 'user'
  newUser.roles = ['user']
  const newToken = await new Promise((resolve, reject) => {
    newUser.save(function (err, user) {
      //if (err) return validationError(res, err)
      if (err) reject(err)
      var token = jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
      resolve(token)
    })
  })
  res.json({ token: newToken })
}
/**
 * Create a guest account - a guest have to reset his password during the first connection
 */
exports.createGuest = function (req, res, next) {
  var newUser = new User(req.body)
  newUser.provider = 'local'
  newUser.role = 'guest'
  newUser.roles = ['guest']
  newUser.save(function (err, user) {
    if (err){
      return validationError(res, err)
    }
    var token = jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
    res.json({token: token })
  })
}
/**
 * Get a single user
 */
exports.show = function (req, res, next) {
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
exports.destroy = function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, user) {
    if (err) return res.status(500).send(err)
    return res.sendStatus(204)
  })
}

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
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
exports.changeGuestPassword = function (req, res, next) {
  try {
    var userId = req.params.id
    var newPass = String(req.body.password)

    User.findById( userId, function (_err, user) {
      console.log(user)
      Invitation.findById( user.invitationId , (err,invite)=>{
        console.log(invite)
        if (err) {
          // handler error
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

//send email function
async function sendResetEmail(_to, _from, _link) {

  let transporter = nodemailer.createTransport({
      host: configEmail.host,
      port: configEmail.port,
      secure: configEmail.secure, // true for 465, false for other ports
      auth: configEmail.auth
  });
  let clientUrl = `${configEmail.rootHTML}/invite/${_from}-${_link}`;
  const mailOptions = {
    from: "noreply@publifactory.co",
    to: _to,
    subject: "Password Reset Request",
    html: `<p> You asked us to send you a password reset link </p>
          <p> Your reset link is: <a href='${clientUrl}'> ${clientUrl}</a></p>`
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}


/**
 * Reset the password and convert it in user // we check that the guest is on the list
 */
exports.resetPassword = function (req, res, next) {
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
          sendResetEmail(email, newLink, newLink);
        }
      })
      // temporary password is newLink - a random key
      user.password = newLink
      user.role = 'guest'
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
exports.updateUser = async function (req, res, next) {
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
exports.me = function (req, res, next) {
  var userId = req.user._id
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
    if (err) return next(err)
    if (!user) return res.json(401)
    res.json(user)
  })
}
