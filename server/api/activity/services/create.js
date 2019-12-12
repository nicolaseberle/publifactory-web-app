const { Request } = require('../model');

async function create( title, fields ) {
	const newRequest = new Request({
    title : title,
		fields: fields,
		status: 'submitted',
	});
	console.log(newRequest)

	await newRequest.save();
	return newRequest;
}

module.exports = create;
