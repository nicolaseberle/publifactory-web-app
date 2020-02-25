const config = require('../../../config');

const frontUrl = config.url;

const emailRequestUpgrade = (associateEditor, journal) => `
<div>
  <p>
    ${associateEditor.firstname} ${associateEditor.lastname}
    an associate editor of the ${journal.title} is using the request reviewer
    service from <strong>Publifactory</strong>.
    <p>
      we provide a freemium trial which consist of 10 free request invitation.
      you are actually at ${journal.billing.subscription.quantity} / 10
    </p>
    He asked if you could upgrade this service from our platform, you can do it on the <a style="text-decoration: none;" href="${frontUrl}/billing/">billing page</a> of publifactory
  </p>
</div>`;

module.exports = emailRequestUpgrade;
