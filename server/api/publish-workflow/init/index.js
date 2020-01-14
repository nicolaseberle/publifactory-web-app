const Journal = require('../../journal/journal.model');

(async () => {
	let preprintCollection = await Journal.findOne({
		title: 'Preprint Collection'
	});
	if (!preprintCollection) {
		preprintCollection = new Journal({
			title: 'Preprint Collection',
			abstract: "Collection for preprint's article",
			status: 'public',
			tags: ['preprint', 'pre-print']
		});
	}
	await preprintCollection.save();
})();
