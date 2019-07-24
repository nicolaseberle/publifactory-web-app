'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var crypto = require('crypto')
const bcrypt = require('bcrypt');

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
  role: {
    type: String,
    default: 'user'
  },
  roles: [{
    type: String,
    default: 'user'
  }],
  articleRights: [{
    type: Schema.Types.ObjectId,
    ref: 'Roles'
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
  },
  isVerified: {
    type: Boolean,
    default: false
  }
})

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = 16
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
  .validate(function (value) {
    return new Promise((resolve, reject) => {
      var self = this
      this.constructor.findOne({ username: value }, function (err, user) {
        if (err) reject(err)
        if (user) {
          if (self.id === user.id) resolve(true)
          else reject(false);
        }
        resolve(true)
      })
    });
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
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    return !password || !this.salt ? '' : bcrypt.hashSync(password, 16);
  }
}

module.exports = mongoose.model('User', UserSchema)
