const config = require('../../../config');

const frontUrl = config.url;
const backUrl =
	config.env === 'development' ? `http://localhost:4000` : config.url;

const emailAccountValidation = (user, link) => `
<div>
  <p>To finish your account follow this
    <a style="text-decoration: none;" href="${frontUrl}/account-validation/${link}">
     link
    </a>
  </p>
</div>`;

module.exports = emailAccountValidation;
