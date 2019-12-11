const { Request } = require('../model');

async function create({ fields, title }) {
	const newRequest = new Request({
		fields,
    title
	});
	newRequest.history.push({
    fields:fields,
    title : title,
		status: 'submitted',
		date: new Date().toUTCString()
	});

	await newRequest.save();
	return newRequest;
}

module.exports = create;
