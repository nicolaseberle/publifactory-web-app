const { backend } = require("../../../config");

const backUrl =
	process.env.NODE_ENV === "development"
		? `http://localhost:${backend.port}`
		: `https://${backend.ip}:${backend.port}`;

function formatDate(date) {
	return `${new Date(date).toLocaleString()}`;
}

const answer = (request, status) =>
	`
  <div>
    <div>
      <p><strong>${request.reviewer.name} ${
		reviewerAnswer[status]
	}</strong> to review the <strong><em>${
		request.title
	}'s</em></strong> article this ${formatDate(
		request.history.slice(-2, -1)[0].date
	)}.
    </p>
      ${
				status === "outfield"
					? ""
					: `
					<p>
						You can reach him at this address:
						<strong>${request.reviewer.email}</strong>
					</p>
				`
			}
    </div>
    <div style="border-top: 1px solid #cccccc; text-align: center;">

      <h6>© Copyright 2018 <a
      href='http://publifactory.co'
      target='_blank'
      rel='noopener noreferrer'
      data-auth='NotApplicable'
      style='font-size:12px; line-height:18px; color:#666666; font-weight:bold'
    >
      Publifactory</a>, All Rights Reserved.</h6>
      <a href='https://app.publifactory.co'> <img widht="25px" height="32px" src="${backUrl}/api/requests/logo/"></a>
    </div>
  </div>
`;

const accepted = `accepted`;
const rejected = `rejected`;
const outfield = `doesn't have the right skills`;

const reviewerAnswer = {
	accepted,
	rejected,
	outfield
};

const summary = request =>
	`
  <div>
    <div>
      <p>
        You asked ${request.reviewer.name} to review <em>${request.title}'s</em> Article.
      </p>
    </div>
      <div style="border-top: 1px solid #cccccc; text-align: center;">

        <h6>© Copyright 2018 <a
        href='http://publifactory.co'
        target='_blank'
        rel='noopener noreferrer'
        data-auth='NotApplicable'
        style='font-size:12px; line-height:18px; color:#666666; font-weight:bold'
      >
        Publifactory</a>, All Rights Reserved.</h6>
        <a href='https://app.publifactory.co'> <img widht="25px" height="32px" src="${backUrl}/api/requests/logo/"></a>
      </div>
    </div>
  </div>
`;

module.exports = {
	answer,
	summary
};
