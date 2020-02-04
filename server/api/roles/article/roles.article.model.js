'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Role Article Schema
 */
const RolesArticleSchema = new Schema({
	id_user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	id_article: {
		type: Schema.Types.ObjectId,
		ref: 'Article'
	},
	right: {
		type: String,
		default: 'guest'
	}
});

/**
 *
 * @type {*|*[]|(function(*, *): (null|*))|(function(*, *): *)|(function(*, *): *)|(function(*, *): *)|(function(*, *=, *=): *)|(function(*=, *, *): boolean)|(function(*, *=, *=): *)|{preTransformNode}|string}
 */
const RolesArticle = mongoose.model('RoleArticle', RolesArticleSchema);

module.exports = RolesArticle;
