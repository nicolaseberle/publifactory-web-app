const config = require('../../../config');

const frontUrl = config.url;

const emailEditorApproval = (request, userId) => `
<div>
  <p>Dear Mr/Ms,</p>
  <p>Publifactory allows Editors from a journal to identify the best suited reviewers for research articles from any field.</p>

  <p>
  ${request.user.name} (${request.user.email}) declared being an
  Associate Editor for your journal: ${request.journal.title}, could you confirm this information ?
  <a style="text-decoration: none;" href="${frontUrl}/approvals/${request.journal._id}/${userId}/${request._id}/accepted">
      Yes
  </a>
    <a style="text-decoration: none;" href="${frontUrl}/approvals/${request.journal._id}/${userId}/${request._id}/rejected">
      Decline
    </a>
    <p>You can also do it from your dashboard <a>LINK TO DASHBOARD</a></>
  </p>
  <p>Sincerely,</p>
  <p>Publifactory Team</p>
</div>`;

module.exports = emailEditorApproval;
