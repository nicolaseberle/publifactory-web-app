const nodemailer = require('nodemailer')
const configEmail = require('../../../config.js').email
const User = require('../user/user.model');

  /**
   * sendEmailToAuthor - send email to new author to invite them
   *
   * @function sendEmailToAuthor
   * @memberof module:controllers/email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */

exports.sendMailToCoAuthor =  async (req, res, next) => {

  const AuthorId = req.body.authorId;
  const emailNewAuthor = req.body.emailDest;

  let transporter = nodemailer.createTransport({
      host: configEmail.host,
      port: configEmail.port,
      secure: configEmail.secure, // true for 465, false for other ports
      auth: configEmail.auth
    });

  // We find the lead author who want to send the email
  const author = await User.findById( AuthorId ).exec();

  const options = {
    from: 'noreply@publifactory.co',
    to: emailNewAuthor,
    subject:  author.firstname + ' ' + author.lastname +  ' has shared an article with you',
    text: 'Hello mec, ' + author.firstname + ' ' + author.lastname +  ' invites you to co-write an article. oupss I forgot the article link',
    html: '<p>Hello mec, ' + author.firstname + ' ' + author.lastname +  ' invites you to co-write an article. oupss I forgot the article link</p>'
  }

  transporter.sendMail(options, (err, info) => {
    if (info) console.log(info)
    if (err) console.log(err)
  })
};
