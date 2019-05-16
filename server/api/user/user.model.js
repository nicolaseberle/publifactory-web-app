'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var crypto = require('crypto')

var UserSchema = new Schema({
  name: {
    type: String,
    default: 'None'
  },
  username: {
    type: String,
    lowercase: true
  },
  orcid : {
    type: String,
    default: 'None'
  },
  lastname: {
    type: String,
    default: 'None'
  },
  firstname: {
    type: String,
    default: 'None'
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  },
  field: {
    type: String,
    default: 'None'
  },
  laboratory: {
    type: String,
    default: 'None'
  },
  tags: [{
    type: String
  }],
  avatar: {
    type: String,
    default: '/static/Default.png'
  },
  role: [{
    type: Schema.Types.ObjectId,
    ref: 'Roles'
  }],
  roles: [{
    type: String,
    default: 'user'
  }],
  hashedPassword: String,
  provider: String,
  salt: String,
  link: {
    type: String,
    default: '/'
  },
  lockedAccount: {
    type: Boolean,
    default: false
  },
  invitationId: {
    type: String,
    default: 'None'
  }
})

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashedPassword = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'name': this.name,
      'role': this.role,
      'roles': this.roles
    }
  })

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role,
      'roles': this.roles
    }
  })

/**
 * Validations
 */

// Validate empty username
UserSchema
  .path('username')
  .validate(function (username) {
    return username.length
  }, 'Username cannot be blank')

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    return hashedPassword.length
  }, 'Password cannot be blank')

// Validate username is not taken
UserSchema
  .path('username')
  .validate(function (value, respond) {
    var self = this
    this.constructor.findOne({ username: value }, function (err, user) {
      if (err) throw err
      if (user) {
        if (self.id === user.id) return respond(true)
        return respond(false)
      }
      respond(true)
    })
  }, 'The specified username is already in use.')

var validatePresenceOf = function (value) {
  return value && value.length
}

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) return next()

    if (!validatePresenceOf(this.hashedPassword)) {
      next(new Error('Invalid password'))
    } else {
      next()
    }
  })

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64')
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return ''
    var salt = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64')
  }
}

module.exports = mongoose.model('User', UserSchema)
