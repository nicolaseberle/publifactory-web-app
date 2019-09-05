/**
 * @module controllers/invitations
 */

 'use strict';

const shortid = require('shortid');
const configEmail = require('../../../config.js').email;

const User = require('../user/user.model');
const Invitation = require('./invitations.model');
const Email = require('../email/email.controller');


/**
 * @function createInvitation
 * @description This function is used to create a new invitations to send by mail
 * This function takes several parameters in the body field:
 *  - link, the link to send to the user
 *  - msg, the message to send with the link
 *  - to, the receiver's mail address
 *  - name, the name of the receiver
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
    let current = new Date().toISOString();
    const newInvitation = new Invitation({
      "created_at": current,
      "updated_at": current,
      "link": newLink,
      "recieptEmail": receiverEmail,
      "senderId": senderId,
      "senderMsg": senderMsg,
      "senderName": senderName
    });
    await newInvitation.save();
    const mail = new Email(receiverEmail);
    if (req.params.role === 'collaborator' || req.params.role === 'reviewer') {
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
    const receiver = await User.findOne({ email: receiverEmail }).exec();
    res.json(receiver)
  } catch (err) {
    next(err);
  }
}

/**
 * @function getMyInvitations
 * @deprecated You need to use checkInvitation.
 * @memberof module:controllers/invitations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getMyInvitations (req, res, next) {
  try {
    let link=req.query.link;
    console.log(link);
    const invitations = await Invitation.findOne({ senderId: link });
    res.json(invitations);
  } catch (err) {
    return next(err);
  }
}

/**
 * @function checkInvitation
 * @description This function is used to verify the authenticity of the
 * invitation's link.
 * @memberof module:controllers/invitations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function checkInvitation(req, res, next) {
  try {
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
        { senderId: sender ,link: inviteLink},
        { $set: { updated_at :seen } }).exec();


    const _sender = await User.findOne({ _id: invitation.senderName }).exec();
    await User.findOneAndUpdate( {'email': invitation.recieptEmail},{ $set: {'invitationId': invitation._id}} ).exec();

    invitation.senderLastname = _sender.lastname;
    invitation.senderFirstname = _sender.firstname;

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
