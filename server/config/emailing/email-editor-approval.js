const config = require('../../../config');

const frontUrl = config.url;
const backUrl =
	config.env === 'development' ? `http://localhost:4000` : config.url;

const emailEditorApproval = (request, userId) => `
<div>
  <p>A potential associate editor ${request.editor.email} ${request.editor.name} used the ${request.editor.journal.title}'s journal to send
  a request.</p>

  <p>This user actually doesn't have any right concerning your journal, if you trust this user as an associate editor you can give
  him the right to send requests to reviewers by clicking:
    <a style="text-decoration: none;" href="${frontUrl}/approvals/${request.editor.journal._id}/${userId}/${request._id}/accepted">
      Here
    </a>
  Or :
    <a style="text-decoration: none;" href="${frontUrl}/approvals/${request.editor.journal._id}/${userId}/${request._id}/rejected">
      Decline
    </a>
  </p>
  <p>
    Text to say you should upgrade your billing. billing.quantity left
  </p>

  <p>You can also do it from your dashboard <a>LINK TO DASHBOARD</a></>
</div>`;

module.exports = emailEditorApproval;
