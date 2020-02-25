const config = require('../../../config');

const frontUrl = config.url;

const emailRequestUpgrade = (associateEditor, journal) => `
<div>
  <p>${associateEditor.firstname} ${associateEditor.lastname} an associate editor of the ${journal.title} is using the request reviewer service from <em>Publifactory</em>.
    paragraphe du contexte billing
    He asked you to upgrade this service, you can do it on the <a style="text-decoration: none;" href="${frontUrl}/billing/">billing page</a> of publifactory
  </p>
</div>`;

module.exports = emailRequestUpgrade;
