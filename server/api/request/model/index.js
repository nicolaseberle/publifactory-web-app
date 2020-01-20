const mongoose = require("mongoose");

const enumStatus = [
	"pending",
	"bademail",
	"sent",
	"remind",
	"read",
	"accepted",
	"rejected",
	"outfield",
	"unsubscribed",
	"done",
	"removed"
];

const RequestSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		abstract: {
			type: String,
			required: true
		},
		deadline: {
			type: Date,
			required: true
		},
		object: {
			type: String
		},
		content: {
			type: String
		},
		remind: {
			type: String
		},
		remindMax: { type: Number, default: 3 },
		remindCount: { type: Number, default: 0 },
		reviewer: {
			semanticScholarId: {
				type: String,
				required: true
			},
			email: {
				type: String
			},
			name: {
				type: String
			}
		},
		editor: {
			name: {
				type: String,
				required: true
			},
			email: {
				type: String,
				required: true
			},
			journal: {
				type: String
			}
		},
		history: {
			type: Array,
			date: Date,
			status: {
				type: String,
				default: "pending",
				enum: {
					values: enumStatus
				}
			}
		}
	},
	{ timestamps: true }
);

module.exports.Request = mongoose.model("Request", RequestSchema);
module.exports.RequestSchema = RequestSchema;
module.exports.enumStatus = enumStatus;
