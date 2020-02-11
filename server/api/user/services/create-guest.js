const jwt = require('jsonwebtoken');
const User = require('../user.model');
const { ApiError } = require('../../../config/error');
const config = require('../../../../config');
const uuidv4 = require('uuid/v4');
const Email = require('../../email/email.controller.js');
const { emailAccountValidation } = require('../../../config/emailing');

async function createGuest({ user }) {
	const uuid = uuidv4();
	const newUser = new User({
		...user,
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
			role: user.role
		},
		config.backend.secrets.session,
		{ expiresIn: '7d' }
	);
	const tokenLink = jwt.sign(
		{
			_id: newUser._id,
			name: newUser.name,
			role: user.role,
			h: uuid,
			email: newUser.email
		},
		config.backend.secrets.session,
		{ expiresIn: '20d' }
	);
	const email = new Email(newUser.email);
	email.sendEmail({
		subject: 'Account validation from publifactory',
		html: emailAccountValidation(user, tokenLink)
	});
	await newUser.save();
	return { user: newUser, token };
}

module.exports = createGuest;
