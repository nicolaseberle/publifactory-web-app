const mongoose = require('mongoose');

const enumStatus = [
	'submitted',
	'success'
];

const RequestSchema = new mongoose.Schema(
	{

			creationDate: { type: Date, default: Date.now },
			title: {
				type: String,
				required: true
			},
			fields:{
				type: Array,
				required: true
			},
			status: {
				type: String,
				default: 'submitted',
				enum: {
					values: enumStatus
				}
			}
	},
	{ timestamps: true }
);

module.exports.Request = mongoose.model('Activity', RequestSchema);
module.exports.RequestSchema = RequestSchema;
module.exports.enumStatus = enumStatus;
