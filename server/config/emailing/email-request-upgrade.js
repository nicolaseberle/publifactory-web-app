const config = require('../../../config');

const frontUrl = config.url;

const emailRequestUpgrade = (associateEditor, journal) => `
<div>

    <p>Dear Mr/Ms,</p>

    <p>Publifactory allows Editors from a journal to identify the best suited reviewers for research articles from any field.</p>

    <p>${associateEditor.firstname} ${associateEditor.lastname}, an associate editor for your journal: ${journal.title},
    would like to use the service, for that matter, you have to upgrade your plan on the
    <a style="text-decoration: none;" href="${frontUrl}/billing/">billing page</a> of Publifactory.</p>

    <p>If this person is not an associate editor you can <a style="text-decoration: none;" href="">(need url)signal it</a></p>
    , we will removed him from the journal</p>

    <p>Sincerely,</p>

    <p>Publifactory Team</p>
  </p>
</div>`;

module.exports = emailRequestUpgrade;
