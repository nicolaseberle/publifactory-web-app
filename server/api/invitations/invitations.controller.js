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
    if (req.body.link === undefined || req.body.msg === undefined ||
      req.body.to === undefined || req.body.name === undefined)
      throw { code: 422, message: 'Missing parameters.' };
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
        if(req.params.role === 'collaborator' || req.params.role === 'reviewer') {
        const clientUrl = `${configEmail.rootHTML}/invite/${senderId}-${newLink}`;
        req.params.role === 'collaborator' ?
          await mail.sendInvitationCoAuthor(req.body.sender, clientUrl) :
          await mail.sendInvitationReviewer(req.body.sender, clientUrl);
        } else {
          const clientUrl = `${configEmail.rootHTML}/invite/${senderId}-${newLink}`;
          req.params.role === 'editor' ?
            await mail.sendInvitationCoEditor(req.body.sender, clientUrl) :
            await mail.sendInvitationJournalAssociateEditor(req.body.sender, clientUrl);
        }
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
    const invitations = await Invitation.findOne({ senderId: link });
    res.json(invitations);
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
    console.log("id :: ", req.params.id);
    const sender = req.params.id
      .trim()
      .split("-")[0]
      .trim();
    console.log("sender :: ",sender);
    const inviteLink = req.params.id
      .trim()
      .split("-")[1]
      .trim();
    console.log("inviteLink :: ",inviteLink);
    const seen = new Date().toISOString();
    const invitation = await Invitation.findOneAndUpdate(
        { senderId: sender ,link: inviteLink},
        { $set: { updated_at :seen } }).exec()

    console.log(invitation)

    const _sender = await User.findOne({ _id: invitation.senderName }).exec();
    const _guest = await User.findOneAndUpdate( {'email': invitation.recieptEmail},{ $set: {'invitationId': invitation._id}} ).exec();

    console.log(_sender)
    invitation.senderLastname = _sender.lastname
    invitation.senderFirstname = _sender.firstname

    return res.json(invitation);

  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createInvitation: createInvitation,
  checkInvitation: checkInvitation,
  getMyInvitations: getMyInvitations
};
