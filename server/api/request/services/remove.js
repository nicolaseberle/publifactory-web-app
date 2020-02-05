const { Request } = require("../model");

async function remove({ requestId, remove = false }) {
	if (remove) {
		const deleted = await Request.findOneAndDelete({ _id: requestId });
		if (!deleted) throw new Error("REQUEST_NOT_FOUND");
		return deleted;
	} else {
		const request = await Request.findById(requestId);
		const status = request.history.reduce(
			(acc, request) => [...acc, request.status],
			[]
		);
		if (status.includes("removed")) return request;
		request.history.push({ status: "removed", date: new Date().toUTCString() });
		await request.save();
		return request;
	}
}

module.exports = remove;
