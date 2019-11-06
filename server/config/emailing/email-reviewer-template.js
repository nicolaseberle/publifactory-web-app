const { backend } = require('../../../config');

const url =
	process.env.NODE_ENV === 'development'
		? `http://localhost:${backend.port}`
		: `https://${backend.ip}:${backend.port}`;

const redirect = requestId => `
  <a href="${url}/api/requests/${requestId}/accepted">
      Accept
  </a>
  <a href="${url}/api/requests/${requestId}/rejected">
    Reject
  </a>
  <a href="${url}/api/requests/${requestId}/outfield">
    Not my field
  </a>
  <div>
    <img src="${url}/seen/${requestId}">
  </div>
`;

const accepted = `
  <p>Thanks for accepted</p>
`;

const rejected = `
  <p>Maybe another time</p>
`;

const outfield = `
  <p>So sad</p>
`;

const alreadyAnswered = `
  <h1>You already answered</h1>
  <h1>You can contact @email if you want</h1>
`;

module.exports = {
	redirect,
	accepted,
	rejected,
	outfield,
	alreadyAnswered
};
