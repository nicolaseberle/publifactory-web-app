const config = require('../../../config');

const frontUrl = config.url;
const backUrl =
	config.env === 'development' ? `http://localhost:4000` : config.url;

const emailEditorApproval = request => `
<div>
  <p>A potential associate editor ${request.editor.email} ${request.editor.name} used the ${request.editor.journal.title} to send
  a request.</p>

  <p>This user actually doesn't have any right concerning your journal, if you trust this user as an associate editor you can give
  him the right to send reviewer request by clicking:</p><a href="needurl">HERE</a> <a href="needurl">DECLINE</a>

  you can also do it from your dashboard <a>LINK TO DASHBOARD</a>
</div>`;

module.exports = emailEditorApproval;
