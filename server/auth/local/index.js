'use strict'

var express = require('express')
var passport = require('passport')
var auth = require('../auth.service')
const axios = require('axios')

var router = express.Router()

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info
    if (error) return res.status(401).json(error)
    if (!user) return res.status(404).json({ message: 'Something went wrong, please try again.' })

    var token = auth.signToken(user)
    res.json({ token: token })
  })(req, res, next)
})

router.post('/orcid', async function (req, res, next) {
  const result = await new Promise((resolve, reject) => {
    axios.get('https://orcid.org/oauth/authorize?client_id=APP-HCKHJYQTALPVGUJ1&response_type=code&scope=/authenticate&redirect_uri=http://localhost:4000/api/auth/local/orcid/callback')
      .then(response => {
        console.log("HERE GUT");
        resolve(response);
      }).catch(error => {
        console.log("HERE BAD");
      }).finally(() => {
        console.log("AXIOS DONE");
      });
  })
  res.json({ success: true });
})

/**
router.get('/orcid', passport.authenticate('orcid'));

router.get('/orcid/callback', passport.authenticate('orcid', {
  failureRedirect: 'http://localhost:9001/login'
}), (req, res) => {
  console.log(res);
})
 **/


module.exports = router
