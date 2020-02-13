const jwt = require('jsonwebtoken');
const User = require('../user.model');
const { ApiError } = require('../../../config/error');
const config = require('../../../../config');
const uuidv4 = require('uuid/v4');
const Email = require('../../email/email.controller.js');
const { emailAccountValidation } = require('../../../config/emailing');

// TODO? FIND BILLING BY EMAIL => reassign
async function createGuest({ email, lastName, firstName }) {
	const uuid = uuidv4();
	const newUser = new User({
		email,
		lastname: lastName,
		firstname: firstName,
		isVerified: true,
		provider: 'local',
		role: 'guest',
		roles: ['guest'],
		password: uuid
	});
	const token = jwt.sign(
		{
			_id: newUser._id,
			name: newUser.name,
			role: newUser.role
		},
		config.backend.secrets.session,
		{ expiresIn: '7d' }
	);
	const tokenLink = jwt.sign(
		{
			_id: newUser._id,
			name: newUser.name,
			role: newUser.role,
			h: uuid,
			email: newUser.email
		},
		config.backend.secrets.session,
		{ expiresIn: '20d' }
	);
	const mailing = new Email(newUser.email);
	mailing.sendEmail({
		subject: 'Account validation from publifactory',
		html: emailAccountValidation(newUser, tokenLink)
	});
	await newUser.save();
	return { user: newUser, token, tokenLink };
}

module.exports = createGuest;
