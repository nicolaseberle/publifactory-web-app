const { Publisher } = require('../model');

async function create(publisher) {
	console.log('publisher', publisher);
	const newPublisher = new Publisher({
		name: publisher.name,
		journal: {
			name: publisher.journal.name,
			issn: publisher.journal.issn,
			editor: publisher.journal.editor
		}
	});
	await newPublisher.save();
	return newPublisher;
}

module.exports = create;
