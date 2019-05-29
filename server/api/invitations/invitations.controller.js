/**
 * @module controllers/invitations
 */

 'use strict';

const shortid = require('shortid')
const configEmail = require('../../../config.js').email

const User = require('../user/user.model')
const Invitation = require('./invitations.model')
const Email = require('../email/email.controller');


/**
 * createInvitation
 *
 * @function createInvitation
 * @memberof module:controllers/invitations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

async function createInvitation(req, res, next) {
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
    const invitation = await newInvitation.save(async (error, result) => {
      if (error) {
        return console.log(error);
      } else {
        //we send the email to invite the new author to access
        const mail = new Email(receiverEmail);
        const clientUrl = `${configEmail.rootHTML}/invite/${senderId}-${newLink}`;
        req.params.role === 'collaborator' ?
          await mail.sendInvitationCoAuthor(req.body.sender, clientUrl) :
          await mail.sendInvitationReviewer(req.body.sender, clientUrl);
      }
    })
    const receiver = await User.findOne({ email: receiverEmail }).exec()
    res.json(receiver)
  } catch (err) {
    next(err);
  }
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

async function getMyInvitations (req, res, next) {
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
}
/**
 * checkInvitation
 *
 * @function checkInvitation
 * @memberof module:controllers/invitations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

async function checkInvitation(req, res, next) {
  try {
    console.log(req.params);
    const sender = req.params.id
      .trim()
      .split("-")[0]
      .trim();
    const inviteLink = req.params.id
      .trim()
      .split("-")[1]
      .trim();
    const seen = new Date().toISOString();
    const invitation = await Invitation.findOneAndUpdate(
        { senderName: sender ,link: inviteLink},
        { $set: { updated_at :seen } })

    const _sender = await User.findById( invitation.senderName ).exec();
    const _guest = await User.findOneAndUpdate( {'email': invitation.recieptEmail},{ $set: {'invitationId': invitation._id}} ).exec();

    invitation.senderLastname = _sender.lastname
    invitation.senderFirstname = _sender.firstname

    return res.status(200).json(invitation);

  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createInvitation: createInvitation,
  checkInvitation: checkInvitation,
  getMyInvitations: getMyInvitations
};
