const config = require('../../../config')

const frontUrl = config.url
const backUrl =
	config.env === 'development' ? `http://localhost:4000` : config.url

const emailAccountValidation = (user, link) => `
<div>
  <p>We created you a temporary account, to finalize this account please follow the link below.
    If you didn't meant to create an account you can also delete it by following the link.
    <a style="text-decoration: none;" href="${frontUrl}/account-validation/${link}/">
     link
    </a>
  </p>
</div>`

module.exports = emailAccountValidation
