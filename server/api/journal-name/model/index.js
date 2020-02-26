const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const JournalSchema = new Schema({
	eraJournalId: { type: Number },
	title: { type: String },
	foreignTitle: { type: String },
	forOne: { type: Number },
	forOneName: { type: String },
	forTwo: { type: Number },
	forTwoName: { type: String },
	forThree: { type: Number },
	forThreeName: { type: String },
	issn1: { type: String },
	issn2: { type: String },
	issn3: { type: String },
	issn4: { type: String },
	issn5: { type: String },
	issn6: { type: String },
	issn7: { type: String }
});

const JournalName = mongoose.model('JournalNames', JournalSchema);

module.exports = JournalName;
