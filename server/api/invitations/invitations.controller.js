/**
 * @module controllers/invitations
 */

 'use strict';

const shortid = require('shortid')
const configEmail = require('../../../config.js').email
const nodemailer = require('nodemailer')

var User = require('../user/user.model');
var Invitation = require('./invitations.model');


/**
 * createInvitation
 *
 * @function createInvitation
 * @memberof module:controllers/invitations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.createInvitation = async (req, res, next) => {
  try {
    let senderId = req.body.link,
        senderMsg = req.body.msg,
        receiverEmail = req.body.to,
        senderName = req.body.name,
        newLink = shortid.generate();
        //to avoid '-' in the link
        while(newLink.indexOf('-')>=0){
             newLink = shortid.generate();
        }

    let current = new Date().toISOString()
    const newInvitation = new Invitation({
      "created_at": current,
      "updated_at": current,
      "link": newLink,
      "recieptEmail": receiverEmail,
      "senderId": senderId,
      "senderMsg": senderMsg,
      "senderName": senderName
    });
    const invitation = await newInvitation.save((error, result) => {
      if (error) {
        return console.log(error);
      } else {
        //we send the email to invite the new author to access
        sendEmail(receiverEmail, senderId, newLink, senderName);
      }
  })
  var reciever = await User.findOne( {email: receiverEmail} ).exec()
  return res.status(200).json(reciever)

  } catch (err) {
    return next(err);
  }
};

//send email function
async function sendEmail(_to, _from, _link, _idSender) {

  const _sender = await User.findById( _idSender ).exec();

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
    subject: "You have been Invited to read an Article",
    html: `<p> ${_sender.firstname}  ${_sender.lastname}  invites you to co-write an article.</p>
          <p> Your invitation link is: <a href='${clientUrl}'> ${clientUrl}</a></p>`
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
 * getMyInvitations
 *
 * @function getMyInvitations
 * @memberof module:controllers/invitations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.getMyInvitations = async (req, res, next) => {
  try {
    let link=req.query.link
    console.log(link)
    const invitations = await Invitation.findOne({ senderId: link }, (error, doc) => {
        if (error) {
        console.log(error);
        } else {
        console.log(doc);
        res.status(200).send(doc.rows);
        }
      }
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * checkInvitation
 *
 * @function checkInvitation
 * @memberof module:controllers/invitations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

exports.checkInvitation = async (req, res, next) => {
  try {

    console.log(req.params);
    let sender = req.params.id
      .trim()
      .split("-")[0]
      .trim();
    let inviteLink = req.params.id
      .trim()
      .split("-")[1]
      .trim();
    let seen = new Date().toISOString();
    let invitation = await Invitation.findOneAndUpdate(
        { senderId: sender ,link: inviteLink},
        { $set: { updated_at :seen } })

    const _sender = await User.findById( invitation.senderName ).exec();

    invitation.senderLastname = _sender.lastname
    invitation.senderFirstname = _sender.firstname

    return res.status(200).json(invitation);

  } catch (err) {
    return next(err);
  }
};
