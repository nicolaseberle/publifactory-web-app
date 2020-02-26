const config = require('../../../config');

const frontUrl = config.url;

const emailRequestUpgrade = (associateEditor, journal) => `
<div>
  <p>
    Dear Mr/Ms,

    Publifactory allows Editors from a journal to identify the best suited reviewers for research articles from any field.

    ${associateEditor.firstname} ${associateEditor.lastname} declared being an
    Associate Editor for your journal: ${journal.title}, ???could you confirm this information? Yes / No???

    He would like to use the service, for that matter, you have to upgrade your plan on the <a style="text-decoration: none;" href="${frontUrl}/billing/">billing page</a> of Publifactory.

    Sincerely,

    Publifactory Team
  </p>
</div>`;

module.exports = emailRequestUpgrade;
