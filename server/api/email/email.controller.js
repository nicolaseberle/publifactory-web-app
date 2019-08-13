'use strict';

const configEmail = require('../../../config.js').email
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const User = require('../user/user.model');

module.exports = class Email {
  constructor(email) {
    this.email = email;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      post: 465,
      secure: true,
      auth: {
        user: configEmail.user,
        pass: configEmail.pass
      }
    });
    this.template = fs.readFileSync(path.join(__dirname, '../../views/template_mail.html')).toString();
  }

  modifyTemplate(options, subject, content, link, contentLink) {
    options.html = options.html.replace(/%%INSERT_TITLE%%/gm, "Publifactory");
    options.html = options.html.replace(/%%HEADER%%/gm, subject);
    options.html = options.html.replace(/%%INSERT_NAME%%/gm, this.email);
    options.html = options.html.replace(/%%INSERT_CONTENT_TEXT%%/gm, content);
    options.html = options.html.replace(/%%INSERT_HTML_LINK%%/gm, link);
    options.html = options.html.replace(/%%INSERT_HTML_CONTENT_LINK%%/gm, contentLink);
    options.html = options.html.replace(/%%INSERT_COMPANY%%/gm, "Publifactory");
    return options.html;
  }

  sendRecuperationPassword(link) {
    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: 'PubliFactory | Password recovering',
      html: this.template
    };

    const subject = "PubliFactory | Password recovering";
    const content = `Hi ${this.email}!
    You just asked to recover your password on our web application.
    Please click on the link below to be redirected on the right platform to define a new password.`;
    const contentLink = "Recover your password!";

    options.html = this.modifyTemplate(options, subject, content, link, contentLink);
    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error);
      else return console.log('Message sent: %s', info.messageId)
    })
  }

  sendEmailConfirmation(link) {
    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: 'PubliFactory | e-mail confirmation',
      html: this.template
    };

    const subject = "PubliFactory | e-mail confirmation";
    const content = `Hi ${this.email}!
    Thank you to have sign up on Publifactory.
    Your account has been created, but you need to confirm you e-mail address.
    Please, just click on the button below to access to our platform!`;
    const contentLink = "Confirm your e-mail!";

    options.html = this.modifyTemplate(options, subject, content, link, contentLink);
    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error);
      else return console.log('Message sent: %s', info.messageId)
    });
  }

  async sendInvitationCoAuthor (authorId, link) {
    const author = await User.findOne({ _id: authorId })

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} want to share an article with you!`,
      html: this.template
    };

    const subject = `PubliFactory | ${author.firstname} ${author.lastname} want to share an article with you!`;
    const content = `Hi ${this.email}!
    An author, ${author.firstname} ${author.lastname} invite you to collaborate on an article.
    Click on the button below to be redirected on his article.`;
    const contentLink = "Check the article!";

    options.html = this.modifyTemplate(options, subject, content, link, contentLink);
    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error);
      else return console.log('Message sent: %s', info.messageId)
    });
  }

  async sendInvitationReviewer (authorId, link) {
    const author = await User.findOne({ _id: authorId })

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} needs your review!`,
      html: this.template
    };

    const subject = `PubliFactory | ${author.firstname} ${author.lastname} needs your review!`;
    const content = `Hi ${this.email}!
    An author, ${author.firstname} ${author.lastname} invite you to review his article.
    You will be able to add revision on specific part and on the entire article.
    Click on the button below to review this article!`;
    const contentLink = "Review this article!";

    options.html = this.modifyTemplate(options, subject, content, link, contentLink);
    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error);
      else return console.log('Message sent: %s', info.messageId)
    });
  }

  async sendInvitationJournalUser (authorId, link) {
    const author = await User.findOne({ _id: authorId })

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} shared a journal with you!`,
      html: this.template
    };

    const subject = `PubliFactory | ${author.firstname} ${author.lastname} shared a journal with you!`;
    const content = `Hi ${this.email}!
    An author, ${author.firstname} ${author.lastname} just shared a journal with you.
    You will be able to follow this journal and read the article added on it.
    Click on the button below to inspect the journal!`;
    const contentLink = "Check the journal!";

    options.html = this.modifyTemplate(options, subject, content, link, contentLink);
    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error);
      else return console.log('Message sent: %s', info.messageId)
    });
  }

  async sendInvitationCoEditor (authorId, link) {
    const author = await User.findOne({ _id: authorId });

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} define you as co-editor!`,
      html: this.template
    };

    const subject = `PubliFactory | ${author.firstname} ${author.lastname} define you as co-editor!`;
    const content = `Hi ${this.email}!
    An author, ${author.firstname} ${author.lastname} define you as co-editor of a journal.
    You will be in charged to define reviewers on articles and to define if an article could be uploaded on the journal.
    Click on the button below to inspect the journal!`;
    const contentLink = "Check the journal!";

    options.html = this.modifyTemplate(options, subject, content, link, contentLink);
    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error);
      else return console.log('Message sent: %s', info.messageId)
    });
  }

  async sendInvitationJournalAssociateEditor (authorId, link) {
    const author = await User.findOne({ _id: authorId });

    const options = {
      from: '"PubliFactory" <publifactory.noreply@gmail.com>',
      to: this.email,
      subject: `PubliFactory | ${author.firstname} ${author.lastname} define you as associate editor!`,
      html: this.template
    };

    const subject = `PubliFactory | ${author.firstname} ${author.lastname} define you as associate editor!`;
    const content = `Hi ${this.email}!
    An author, ${author.firstname} ${author.lastname} define you as associate editor of a journal.
    You will be in charged to define reviewers on articles and to define if an article could be uploaded on the journal.
    Click on the button below to inspect the journal!`;
    const contentLink = "Check the journal!";

    options.html = this.modifyTemplate(options, subject, content, link, contentLink);
    this.transporter.sendMail(options, (error, info) => {
      if (error) return console.log(error);
      else return console.log('Message sent: %s', info.messageId)
    });
  }
};
