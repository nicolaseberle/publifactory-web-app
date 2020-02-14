'use strict';

const RolesJournal = require('./roles.journal.model');
const RolesArticle = require('../article/roles.article.model');

/**
 * @function createRole
 * @description This function is used to assign a new role on an user from a journal
 * This function takes 3 parameters in the body field :
 *  - id_user, which is the targeted user
 *  - id_journal, which is the targeted journal
 *  - right, the right which need to be set on the user on the journal
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function createRole(req, res, next) {
	try {
		if (!(req.body.id_user && req.body.id_journal && req.body.right))
			throw { code: 422, message: 'Missing parameters in body field.' };
		if (!['editor', 'associate_editor', 'user'].includes(req.body.right))
			throw { code: 404, message: "This right doesn't exist." };
		const id_user = req.body.id_user;
		const id_journal = req.body.id_journal;
		const right = req.body.right;
		const roles = new RolesJournal({ id_user, id_journal, right });
		roles.save();
		res.json({ success: true });
	} catch (e) {
		next(e);
	}
}

/**
 * @function modifyRight
 * @description This function is used to modify the right set on the user on a journal
 * This functions only takes a right parameter in the body field
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function modifyRight(req, res, next) {
	try {
		if (!req.body.right)
			throw { code: 422, message: 'Missing parameters in body field.' };
		if (!['editor', 'associate_editor', 'user'].includes(req.body.right))
			throw { code: 404, message: "This right doesn't exist." };
		const query = { _id: req.params.id };
		const newValues = { $set: { right: req.body.right } };
		await RolesJournal.updateOne(query, newValues, (err, result) => {
			if (err) throw err;
			else console.log(`Document updated ; Result -> ${result}`);
		});
		res.json({ success: true });
	} catch (e) {
		next(e);
	}
}

/**
 * @function deleteRole
 * @description This function is used to revoke a role on a Journal
 * This function just takes the id of the created roles on the url parameters
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function deleteRole(req, res, next) {
	try {
		const query = { _id: req.params.id };
		await RolesJournal.deleteOne(query, (err, result) => {
			if (err) throw err;
			else console.log(`Document deleted ; Result -> ${result}`);
		});
		res.json({ success: true });
	} catch (e) {
		next(e);
	}
}

/**
 * @function getRoleById
 * @description This function is used to retrieve the information about a journal's role
 * from its id on the url parameters
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function getRoleById(req, res, next) {
	try {
		const query = { _id: req.params.id };
		const response = await new Promise(async (resolve, reject) => {
			resolve(await RolesJournal.find(query));
		});
		res.json({ success: true, role: response });
	} catch (e) {
		next(e);
	}
}

/**
 * @function getUserRoles
 * @description This function is used to retrieve the information about every journal's roles
 * from an user's id.
 * It can takes an id in the url parameter for a specific user and doesn't need
 * an id if this is for himself
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function getUserRoles(req, res, next) {
	try {
		const query = { id_user: req.params.id ? req.params.id : req.decoded._id };
		const response = await RolesJournal.find(query).exec();
		res.json({ success: true, role: response });
	} catch (e) {
		next(e);
	}
}

/**
 * @function getJournalUsers
 * @description This function is used to retrieve the journal's users from a journal's id.
 * If the right parameter is specified in the url, this function will filter out
 * the users by their rights.
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function getJournalUsers(req, res, next) {
	try {
		const query = { id_journal: req.params.id_journal };
		if (req.params.right) query.right = req.params.right;
		// console.log('getJournalUsers ::  query :: ',query)
		const users = await RolesJournal.find(query)
			.populate('id_user')
			.exec();
		// console.log('getJournalUsers :: ', users)
		res.json({ success: true, users: users });
	} catch (e) {
		next(e);
	}
}

/**
 * @function invite
 * @description This middleware is used to check if the user has the rights to invite another user
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function invite(req, res, next) {
	try {
		if (req.params.right !== 'user') {
			req.route = 'invite';
			await doYouHaveThisRight(req, res, next);
		} else next();
	} catch (e) {
		next(e);
	}
}

/**
 * @function publish
 * @description This middleware is used to check if the user has the rights to publish in the journal
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function publish(req, res, next) {
	try {
		req.route = 'publish';
		await doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
}

/**
 * @function owner
 * @description This middleware is used to check if the user is the owner of the article in
 * the targeted journal
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function owner(req, res, next) {
	try {
		req.route = 'owner';
		req.params.id_article = req.params.id_article || req.body.id_article;
		await doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
}

/**
 * @function administration
 * @description This middleware is used to check if the user is the administrator of the
 * journal
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function administration(req, res, next) {
	try {
		req.route = 'admin';
		await doYouHaveThisRight(req, res, next);
	} catch (e) {
		next(e);
	}
}

/**
 * @function switchRoute
 * @description This function is used to verify if an user has the specific rights to request
 * a specific route
 * It returns nothing if the user has the necessary rights but throw an error
 * message if he doesn't
 * @param req
 * @param journalInfo
 * @return {Promise<void>}
 */
async function switchRoute(req, journalInfo) {
	switch (req.route) {
		case 'owner':
			const query = {
				id_user: journalInfo.id_user,
				id_article: req.params.id_article
			};
			const articleInfo = await RolesArticle.findOne(query);
			if (!articleInfo || articleInfo.right !== 'author')
				throw { message: 'Only the author can post his article in a journal.' };
			break;
		case 'invite':
		case 'inviteEditor':
			if (journalInfo.right !== 'editor')
				throw { message: 'Only the editor can add new editor' };
			break;
		case 'inviteAssociateEditor':
			if (journalInfo.right !== 'editor')
				throw { message: 'Only the editor can add new associate editor' };
			break;
		case 'removeAssociateEditor':
			if (journalInfo.right !== 'editor')
				throw { message: 'Only the editor can remove an associate editor' };
			break;
		case 'unfollowJournal':
			if (
				journalInfo.right === 'editor' ||
				journalInfo.right === 'associate_editor'
			)
				throw {
					message: 'Editor and Associate Editor can not unfollow a journal'
				};
			break;
		case 'removeJournal':
			if (journalInfo.right !== 'editor')
				throw { message: 'Only the editor can remove the journal' };
			break;
		case 'admin':
			if (journalInfo.right !== 'editor')
				throw {
					message: 'Only the editor (admin) can access to thoses settings.'
				};
			break;
		case 'publish':
			if (
				journalInfo.right !== 'editor' &&
				journalInfo.right !== 'associate_editor'
			)
				throw {
					message:
						'Only the editor and the associate_editor can decide to publish the article ' +
						'on the journal'
				};
			break;
	}
}

/**
 * @function doYouHaveThisRight
 * @description This function is used to request information about a journal before to verify
 * if the user has the rights to call a protected route.
 * If the user doesn't have these rights, it will throw a HTTP 403 code
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
async function doYouHaveThisRight(req, res, next) {
	try {
		const journalInfo = await new Promise((resolve, reject) => {
			const query = { id_user: req.decoded._id, id_journal: req.params.id };
			RolesJournal.findOne(query, function(err, data) {
				if (err) reject(err);
				else if (data === null)
					resolve({
						id_user: req.decoded._id,
						id_journal: req.params.id,
						right: 'user'
					});
				else resolve(data);
			});
		});
		await switchRoute(req, journalInfo);
		next();
	} catch (e) {
		console.error(e);
		// Throw to catch the error and transmit it to the router.use route.
		// The router.use will res.status(e.code).json({ success: false, message: "THE ERROR MESSAGE" });
		throw { code: 403, message: e.message };
	}
}

/**
 *
 * @type {{getRoleById: *, owner: *, doYouHaveThisRight: *, getJournalUsers: *, administration: *, publish: *, switchRoute: *, createRole: *, modifyRight: *, invite: *, getUserRoles: *, deleteRole: *}}
 */
module.exports = {
	createRole: createRole,
	modifyRight: modifyRight,
	deleteRole: deleteRole,
	getRoleById: getRoleById,
	getUserRoles: getUserRoles,
	getJournalUsers: getJournalUsers,
	invite: invite,
	publish: publish,
	owner: owner,
	administration: administration,
	switchRoute: switchRoute,
	doYouHaveThisRight: doYouHaveThisRight
};
