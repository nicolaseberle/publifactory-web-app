'use strict';

const configEmail = require('../../../config.js').email;
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const User = require('../user/user.model');

/**
 * @class Email
 * @description This class is used to create transport to send SMTP message
 * through gmail's SMTP endpoint.
 * @type {Email}
 */
module.exports = class Email {
	/**
	 * This is the constructor of the Email class
	 * @param email
	 */
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
		this.template = fs
			.readFileSync(path.join(__dirname, '../../views/template_mail.html'))
			.toString();
	}

	/**
	 * @method modifyTemplate
	 * @description This function is used to modify the HTML template and replace
	 * the prepared emplacement by the rights values
	 * @param subject
	 * @param content
	 * @param link
	 * @param contentLink
	 * @return {{subject: *, from: string, html: string, to: *}}
	 */
	modifyTemplate(subject, content, link, contentLink) {
		this.template = this.template.replace(/%%INSERT_TITLE%%/gm, 'Publifactory');
		this.template = this.template.replace(/%%HEADER%%/gm, subject);
		this.template = this.template.replace(/%%INSERT_NAME%%/gm, this.email);
		this.template = this.template.replace(/%%INSERT_CONTENT_TEXT%%/gm, content);
		this.template = this.template.replace(/%%INSERT_HTML_LINK%%/gm, link);
		this.template = this.template.replace(
			/%%INSERT_HTML_CONTENT_LINK%%/gm,
			contentLink
		);
		this.template = this.template.replace(
			/%%INSERT_COMPANY%%/gm,
			'Publifactory'
		);
		return {
			from: '"PubliFactory" <publifactory.noreply@gmail.com>',
			to: this.email,
			subject: subject,
			html: this.template
		};
	}

	sendEmailRequestEditor(subject, template) {
		this.transporter.sendMail({
			from: '"PubliFactory" <publifactory.noreply@gmail.com>',
			to: this.email,
			subject,
			html: template
		});
	}

	sendEmailRequestReviewer(request, template, cb) {
		this.transporter.sendMail(
			{
				from: '"PubliFactory" <publifactory.noreply@gmail.com>',
				to: this.email,
				subject: request.object,
				html: template
			},
			(err, info) => cb(err, info)
		);
	}

	sendEmail(options, cb = null) {
		this.transporter.sendMail(
			{
				from: '"PubliFactory" <publifactory.noreply@gmail.com>',
				to: this.email,
				...options
			},
			(err, info) => {
				if (cb) cb(err, info);
			}
		);
	}

	/**
	 * @method sendMail
	 * @description This function is only used to send the prepared email
	 * @param options
	 */
	sendMail(options) {
		this.transporter.sendMail(options, (error, info) => {
			if (error) return console.log(error);
			else return console.log('Message sent: %s', info.messageId);
		});
	}

	/**
	 * @method sendRecuperationPassword
	 * @description This method is used for the password recovering
	 * @param link
	 */
	sendRecuperationPassword(link) {
		const subject = 'PubliFactory | Password recovering';
		const content = `Hi ${this.email}!\n
    You just asked to recover your password on our web application.\n
    Please click on the link below to be redirected on the right platform to define a new password.\n`;
		const contentLink = 'Recover your password!';

		const options = this.modifyTemplate(subject, content, link, contentLink);
		this.sendMail(options);
	}

	/**
	 * @method sendEmailConfirmation
	 * @description This method is used to confirm the user's email
	 * @param link
	 */
	sendEmailConfirmation(link) {
		const subject = 'PubliFactory | e-mail confirmation';
		const content = `Hi ${this.email}!\n
    Thank you to have sign up on Publifactory.\n
    Your account has been created, but you need to confirm you e-mail address.\n
    Please, just click on the button below to access to our platform!\n`;
		const contentLink = 'Confirm your e-mail!';

		const options = this.modifyTemplate(subject, content, link, contentLink);
		this.sendMail(options);
	}

	/**
	 * @method sendInvitationCoAuthor
	 * @description This method is used invite an author to collaborate on an article
	 * @param authorId
	 * @param link
	 * @return {Promise<void>}
	 */
	async sendInvitationCoAuthor(authorId, link) {
		const author = await User.findOne({ _id: authorId });
		const subject = `PubliFactory | ${author.firstname} ${author.lastname} want to share an article with you!`;
		const content = `Hi ${this.email}!\n
    An author, ${author.firstname} ${author.lastname} invite you to collaborate on an article.\n
    Click on the button below to be redirected on his article.\n`;
		const contentLink = 'Check the article!';

		const options = this.modifyTemplate(subject, content, link, contentLink);
		this.sendMail(options);
	}

	/**
	 * @method sendInvitationReviewer
	 * @description This method is used to invite reviewer on an article
	 * @param authorId
	 * @param link
	 * @return {Promise<void>}
	 */
	async sendInvitationReviewer(authorId, link) {
		const author = await User.findOne({ _id: authorId });
		const subject = `PubliFactory | ${author.firstname} ${author.lastname} needs your review!`;
		const content = `Hi ${this.email}!\n
    An author, ${author.firstname} ${author.lastname} invite you to review his article.\n
    You will be able to add revision on specific part and on the entire article.\n
    Click on the button below to review this article!\n`;
		const contentLink = 'Review this article!';

		const options = this.modifyTemplate(subject, content, link, contentLink);
		this.sendMail(options);
	}

	/**
	 * @method sendInvitationJournalUser
	 * @description This method is used to invite an user to this Journal
	 * @param authorId
	 * @param link
	 * @return {Promise<void>}
	 */
	async sendInvitationJournalUser(authorId, link) {
		const author = await User.findOne({ _id: authorId });
		const subject = `PubliFactory | ${author.firstname} ${author.lastname} shared a journal with you!`;
		const content = `Hi ${this.email}!\n
    An author, ${author.firstname} ${author.lastname} just shared a journal with you.\n
    You will be able to follow this journal and read the article added on it.\n
    Click on the button below to inspect the journal!\n`;
		const contentLink = 'Check the journal!';

		const options = this.modifyTemplate(subject, content, link, contentLink);
		this.sendMail(options);
	}

	/**
	 * @method sendInvitationCoEditor
	 * @description This function is used to invite an user to be a CoEditor of a
	 * journal
	 * @param authorId
	 * @param link
	 * @return {Promise<void>}
	 */
	async sendInvitationCoEditor(authorId, link) {
		const author = await User.findOne({ _id: authorId });
		const subject = `PubliFactory | ${author.firstname} ${author.lastname} define you as co-editor!`;
		const content = `Hi ${this.email}!\n
    An author, ${author.firstname} ${author.lastname} define you as co-editor of a journal.\n
    You will be in charged to define reviewers on articles and to define if an article could be uploaded on the journal.\n
    Click on the button below to inspect the journal!\n`;
		const contentLink = 'Check the journal!';

		const options = this.modifyTemplate(subject, content, link, contentLink);
		this.sendMail(options);
	}

	/**
	 * @method sendInvitationJournalAssociateEditor
	 * @description This function is used to invite an user to be an
	 * associate_editor of a journal
	 * @param authorId
	 * @param link
	 * @return {Promise<void>}
	 */
	async sendInvitationJournalAssociateEditor(authorId, link) {
		const author = await User.findOne({ _id: authorId });
		const subject = `PubliFactory | ${author.firstname} ${author.lastname} define you as associate editor!`;
		const content = `Hi ${this.email}!\n
    An author, ${author.firstname} ${author.lastname} define you as associate editor of a journal.\n
    You will be in charged to define reviewers on articles and to define if an article could be uploaded on the journal.\n
    Click on the button below to inspect the journal!\n`;
		const contentLink = 'Check the journal!';

		const options = this.modifyTemplate(subject, content, link, contentLink);
		this.sendMail(options);
	}
};
